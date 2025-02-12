# Business Marketing Assistant

A powerful React-based marketing assistant tool that helps small businesses manage their online presence across multiple platforms. The application uses OpenAI's GPT-3.5 Turbo model to generate platform-specific content and provides a comprehensive post management system.

## Features

### 1. AI-Powered Content Generation
- Platform-specific content optimization
- Uses existing content as input for AI enhancement
- Custom prompts based on platform and post type
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
- Schedule posts for multiple platforms
- Edit and update scheduled posts
- Track post history and changes
- Delete scheduled posts

### 4. Post Types
- General Updates
- Promotional Content
- Product Launches
- Event Announcements
- Customer Testimonials
- Behind the Scenes
- Tips & Tricks

### 5. Security & Validation
- Secure OpenAI API key management
- Input validation
- Date validation for scheduling
- Platform-specific content validation
- Error handling for API calls

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

## Technologies Used

- React
- Tailwind CSS
- Framer Motion
- OpenAI API (GPT-3.5 Turbo)
- LocalStorage for data persistence

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.