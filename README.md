# Business Marketing Assistant

A frontend-only React application that helps small businesses manage their online presence across multiple platforms. The application uses OpenAI's GPT-3.5 Turbo model to generate platform-specific content and provides a comprehensive post management system, with all data stored locally in the browser.

## Features

### 1. AI-Powered Content Generation
- Generate optimized content for different platforms
- Enhance existing content using AI
- Platform-specific content suggestions
- Custom prompts based on post type
- Character limit validation

### 2. Multi-Platform Support
- Twitter (280 characters)
- Facebook (63,206 characters)
- Facebook Ads (125 characters)
- Instagram (2,200 characters)
- LinkedIn (3,000 characters)
- Google Ads (90 characters)
- TikTok (2,200 characters)

### 3. Post Management
- Create and schedule posts
- Edit scheduled posts
- Delete posts
- Track post history with timestamps
- Local storage for data persistence

### 4. Post Types
- General Updates
- Promotional Content
- Product Launches
- Event Announcements
- Customer Testimonials
- Behind the Scenes
- Tips & Tricks

### 5. Features & Validation
- Secure OpenAI API key management
- Input validation
- Date validation for scheduling
- Platform-specific content limits
- Error handling and notifications
- Responsive design

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/abhinavv-soni/Business-Marketing-Assistant.git
```

2. Install dependencies:
```bash
cd Business-Marketing-Assistant
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Configuration

1. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
2. Enter your API key in the application's "OpenAI API Configuration" section
3. The API key will be stored securely in your browser's localStorage

## Technologies Used

- React (Frontend only)
- Tailwind CSS for styling
- Framer Motion for animations
- OpenAI API (GPT-3.5 Turbo) for content generation
- Browser's localStorage for data persistence

## Key Implementation Details

1. Frontend-Only Architecture:
   - No backend server required
   - All data stored in browser's localStorage
   - Direct OpenAI API integration from frontend

2. Data Persistence:
   - Posts stored in localStorage
   - API key securely saved in localStorage
   - Post history and edits tracked locally

3. Security:
   - API key stored securely in localStorage
   - Input validation and sanitization
   - Error handling for API calls

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.