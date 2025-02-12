import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Send, Trash2, Key, Plus, Check, X, Sparkles, Edit2 } from 'lucide-react';
import './App.css';

function App() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState('');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ 
    content: '', 
    platform: 'twitter', 
    scheduledDate: '',
    postType: 'general'
  });
  const [editingPost, setEditingPost] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    if (message) {
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    }
  };

  const platforms = [
    { value: 'twitter', label: 'Twitter' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'google_ads', label: 'Google Ads' },
    { value: 'facebook_ads', label: 'Facebook Ads' },
    { value: 'tiktok', label: 'TikTok' }
  ];

  const postTypes = [
    { value: 'general', label: 'General Update' },
    { value: 'promotion', label: 'Promotional' },
    { value: 'product_launch', label: 'Product Launch' },
    { value: 'event', label: 'Event Announcement' },
    { value: 'testimonial', label: 'Customer Testimonial' },
    { value: 'behind_scenes', label: 'Behind the Scenes' },
    { value: 'tips', label: 'Tips & Tricks' }
  ];

  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setSavedKey(savedApiKey);
    }
    const savedPosts = localStorage.getItem('scheduled_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      showNotification('Please enter an API key', 'error');
      return;
    }
    localStorage.setItem('openai_api_key', apiKey);
    setSavedKey(apiKey);
    setApiKey('');
    showNotification('API key saved successfully', 'success');
  };

  const generateAIContent = async () => {
    if (!savedKey) {
      showNotification('Please configure your OpenAI API key first', 'error');
      return;
    }

    if (!newPost.platform || !newPost.postType) {
      showNotification('Please select a platform and post type', 'error');
      return;
    }

    setIsGenerating(true);
    showNotification('', '');

    try {
      const platformPrompts = {
        twitter: {
          prompt: 'Keep it concise and engaging, under 280 characters.',
          maxLength: 280
        },
        facebook: {
          prompt: 'Create an engaging post with a clear call-to-action.',
          maxLength: 63206
        },
        facebook_ads: {
          prompt: 'Create a compelling ad with clear value proposition and strong CTA.',
          maxLength: 125
        },
        instagram: {
          prompt: 'Create a visually descriptive post with relevant hashtags.',
          maxLength: 2200
        },
        linkedin: {
          prompt: 'Maintain a professional tone suitable for business networking.',
          maxLength: 3000
        },
        google_ads: {
          prompt: 'Create a compelling ad copy with clear value proposition and CTA.',
          maxLength: 90
        },
        tiktok: {
          prompt: 'Create a trendy and engaging content idea suitable for short-form video.',
          maxLength: 2200
        }
      };

      const platformConfig = platformPrompts[newPost.platform] || {
        prompt: 'Create engaging social media content.',
        maxLength: 2000
      };

      const typePrompts = {
        general: 'Focus on sharing updates and information.',
        promotion: 'Include compelling offers and clear call-to-action.',
        product_launch: 'Build excitement and highlight key features/benefits.',
        event: 'Include key event details and encourage participation.',
        testimonial: 'Highlight customer success and satisfaction.',
        behind_scenes: 'Share authentic, engaging glimpses of business operations.',
        tips: 'Provide valuable, actionable advice for the audience.'
      };

      const baseContent = newPost.content.trim();
      const contentPrompt = baseContent 
        ? `Use this content as inspiration: "${baseContent}". Enhance and optimize it for the platform while maintaining the core message.`
        : 'Create new content based on the post type and platform requirements.';

      const prompt = `As a professional social media marketer, create a ${newPost.postType} post for ${newPost.platform}.
                     ${platformConfig.prompt}
                     ${typePrompts[newPost.postType] || ''}
                     ${contentPrompt}
                     Follow these guidelines:
                     - Keep within ${platformConfig.maxLength} characters
                     - Use appropriate tone and style for ${newPost.platform}
                     - Include relevant hashtags if appropriate
                     - Make it engaging and conversion-focused
                     - If original content is provided, maintain its core message while optimizing for the platform`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${savedKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are an expert social media marketer who creates platform-specific, engaging content. You understand the best practices and limitations of each platform."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 250,
          temperature: 0.7
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to generate content');
      }
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response from AI service');
      }

      let generatedContent = data.choices[0].message.content.trim();
      
      // Ensure content meets platform limits
      if (generatedContent.length > platformConfig.maxLength) {
        generatedContent = generatedContent.substring(0, platformConfig.maxLength - 3) + '...';
      }

      setNewPost({
        ...newPost,
        content: generatedContent
      });
      showNotification('Content generated successfully', 'success');
    } catch (err) {
      console.error('AI Generation Error:', err);
      
      const errorMessages = {
        'API key': 'Invalid API key. Please check your OpenAI API key configuration.',
        'insufficient_quota': 'API quota exceeded. Please check your OpenAI account.',
        'rate_limit': 'Too many requests. Please try again in a moment.',
        'invalid_request_error': 'Invalid request. Please check your inputs.',
        'model_not_found': 'AI model unavailable. Please try again later.'
      };

      const errorMessage = Object.entries(errorMessages).find(([key]) => 
        err.message.includes(key)
      )?.[1] || 'Failed to generate content. Please try again.';

      showNotification(errorMessage, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSchedulePost = () => {
    if (!newPost.content || !newPost.scheduledDate || !newPost.platform || !newPost.postType) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    const scheduledDate = new Date(newPost.scheduledDate);
    if (scheduledDate < new Date()) {
      showNotification('Please select a future date and time', 'error');
      return;
    }

    // Validate content length based on platform
    const platformLimits = {
      twitter: 280,
      facebook: 63206,
      facebook_ads: 125,
      instagram: 2200,
      linkedin: 3000,
      google_ads: 90,
      tiktok: 2200
    };

    const limit = platformLimits[newPost.platform] || 2000;
    if (newPost.content.length > limit) {
      showNotification(`Content exceeds ${newPost.platform} limit of ${limit} characters`, 'error');
      return;
    }

    let updatedPosts;
    if (editingPost) {
      // Update existing post
      updatedPosts = posts.map(post => 
        post.id === editingPost.id 
          ? { 
              ...post, 
              ...newPost, 
              updatedAt: new Date().toISOString(),
              status: 'scheduled'
            }
          : post
      );
      setEditingPost(null);
    } else {
      // Create new post
      const post = {
        id: Date.now(),
        ...newPost,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };
      updatedPosts = [...posts, post];
    }

    setPosts(updatedPosts);
    localStorage.setItem('scheduled_posts', JSON.stringify(updatedPosts));
    setNewPost({ content: '', platform: 'twitter', scheduledDate: '', postType: 'general' });
    showNotification('', '');

    // Show success message
    const message = editingPost ? 'Post updated successfully!' : 'Post scheduled successfully!';
    showNotification(message, 'success');
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setNewPost({
      content: post.content,
      platform: post.platform,
      scheduledDate: post.scheduledDate,
      postType: post.postType
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePost = (postId) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts);
    localStorage.setItem('scheduled_posts', JSON.stringify(updatedPosts));
    if (editingPost?.id === postId) {
      setEditingPost(null);
      setNewPost({ content: '', platform: 'twitter', scheduledDate: '', postType: 'general' });
    }
    showNotification('Post deleted successfully', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-soft border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-display font-bold bg-gradient-to-r from-primary-600 to-accent-500 text-transparent bg-clip-text"
          >
            Business Marketing Assistant
          </motion.h1>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* API Key Section */}
        <motion.section 
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="card mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Key className="w-6 h-6 text-primary-500" />
            <h2 className="text-2xl font-display">OpenAI API Configuration</h2>
          </div>
          {!savedKey ? (
            <div className="flex gap-4">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your OpenAI API key"
                className="input flex-1"
              />
              <button
                onClick={handleSaveApiKey}
                className="btn btn-primary"
              >
                <Key className="w-4 h-4 mr-2" />
                Save API Key
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-green-700 font-medium">API Key configured successfully</span>
              <button
                onClick={() => {
                  localStorage.removeItem('openai_api_key');
                  setSavedKey('');
                  showNotification('API key removed', 'success');
                }}
                className="ml-auto btn btn-secondary text-red-600 hover:bg-red-50 hover:border-red-200"
              >
                <X className="w-4 h-4 mr-2" />
                Remove Key
              </button>
            </div>
          )}
        </motion.section>

        {/* Post Creator Section */}
        <motion.section 
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="card mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-display">
                {editingPost ? 'Edit Post' : 'Post Creator'}
              </h2>
            </div>
            {editingPost && (
              <button
                onClick={() => {
                  setEditingPost(null);
                  setNewPost({ content: '', platform: 'twitter', scheduledDate: '', postType: 'general' });
                  showNotification('', '');
                }}
                className="btn btn-secondary"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel Edit
              </button>
            )}
          </div>
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {notification.message && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-lg border ${
                    notification.type === 'error' 
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-green-50 text-green-700 border-green-200'
                  }`}
                >
                  {notification.message}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="platform" className="label">Platform</label>
                <select
                  id="platform"
                  value={newPost.platform}
                  onChange={(e) => setNewPost({ ...newPost, platform: e.target.value })}
                  className="input"
                >
                  {platforms.map(platform => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="post-type" className="label">Post Type</label>
                <select
                  id="post-type"
                  value={newPost.postType}
                  onChange={(e) => setNewPost({ ...newPost, postType: e.target.value })}
                  className="input"
                >
                  {postTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="post-content" className="label">Post Content</label>
              <div className="relative">
                <textarea
                  id="post-content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Write your engaging post content here..."
                  className="input h-32 resize-none"
                />
                <button
                  onClick={generateAIContent}
                  disabled={isGenerating || !savedKey}
                  className="absolute top-2 right-2 btn btn-secondary"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate with AI'}
                </button>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="schedule-date" className="label">Schedule Date</label>
                <input
                  id="schedule-date"
                  type="datetime-local"
                  value={newPost.scheduledDate}
                  onChange={(e) => setNewPost({ ...newPost, scheduledDate: e.target.value })}
                  className="input"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSchedulePost}
                  disabled={!newPost.content || !newPost.scheduledDate}
                  className="btn btn-primary h-[42px]"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {editingPost ? 'Update Post' : 'Schedule Post'}
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Scheduled Posts Section */}
        <motion.section 
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="card"
        >
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-primary-500" />
            <h2 className="text-2xl font-display">Scheduled Posts</h2>
          </div>
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {posts.map((post) => (
                <motion.div 
                  key={post.id} 
                  className="card-hover rounded-lg border border-gray-100 p-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700 capitalize">
                        {post.platform}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-50 text-secondary-700 ml-2 capitalize">
                        {post.postType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                        aria-label="Edit post"
                        data-testid="edit-post"
                      >
                        <motion.div whileHover={{ scale: 1.1 }}>
                          <Edit2 className="w-5 h-5" />
                        </motion.div>
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Delete post"
                        data-testid="delete-post"
                      >
                        <motion.div whileHover={{ scale: 1.1 }}>
                          <Trash2 className="w-5 h-5 trash-icon" />
                        </motion.div>
                      </button>
                    </div>
                  </div>
                  {post.updatedAt && (
                    <div className="text-xs text-gray-500 mb-2">
                      Last edited: {new Date(post.updatedAt).toLocaleString()}
                    </div>
                  )}
                  <p className="text-gray-700 mb-3">{post.content}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <time>{new Date(post.scheduledDate).toLocaleString()}</time>
                  </div>
                </motion.div>
              ))}
              {posts.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No posts scheduled yet</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

export default App;