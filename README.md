﻿# 🧠 SmartTech Calendar

A next-generation smart calendar application designed specifically for engineers, developers, and tech enthusiasts. Manage hackathons, conferences, seminars, and tech events with AI-powered intelligence.

![SmartTech Calendar](https://img.shields.io/badge/React-18.3.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue) ![Vite](https://img.shields.io/badge/Vite-7.0.2-purple) ![Made by](https://img.shields.io/badge/Made%20by-Debsmit16-brightgreen)

## ✨ Features

### 🤖 AI-Powered Event Management
- **Smart Event Parsing**: Natural language processing with 90%+ accuracy
- **Confidence Scoring**: Real-time AI confidence indicators
- **Auto-categorization**: Automatically categorizes events (hackathons, conferences, workshops)
- **Intelligent Date/Time Extraction**: Understands relative dates like "tomorrow", "next Friday"

### 🎤 Multi-Input Event Creation
- **Voice Input**: Real-time speech recognition using Web Speech API
- **Text Input**: Smart natural language processing
- **Image OCR**: Extract event details from posters using Tesseract.js
- **Drag & Drop**: Easy image upload with visual feedback

### 🌟 Event Discovery System
- **Multi-Platform Integration**: Events from Devpost, HackerEarth, Eventbrite, Meetup, GitHub
- **Advanced Filtering**: Filter by type, platform, difficulty, location, price
- **Trending Events**: Curated high-rated events
- **One-Click Add**: Instantly add discovered events to your calendar

### 🔔 Smart Notification System
- **Intelligent Scheduling**: Automatic reminders before events and deadlines
- **Priority-Based**: Urgent, high, medium, low priority notifications
- **Quiet Hours**: Respects your sleep schedule
- **Browser Integration**: Native browser notifications with actions
- **Achievement System**: Celebrates your milestones

### 🎨 Beautiful UI/UX
- **Glassmorphism Design**: Modern dark purple gradient glass interface
- **Smooth Animations**: Professional transitions and hover effects
- **Responsive Design**: Works perfectly on desktop and mobile
- **Accessibility**: WCAG compliant with keyboard navigation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern browser with JavaScript enabled

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/smarttech-calendar.git
cd smarttech-calendar
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:5173`

## 🛠️ Tech Stack

- **Frontend**: React 18.3.1 + TypeScript
- **Build Tool**: Vite 7.0.2
- **Styling**: CSS3 with Glassmorphism effects
- **Voice Recognition**: Web Speech API
- **OCR**: Tesseract.js
- **Date Parsing**: Custom NLP algorithms
- **Notifications**: Browser Notification API

## 📱 Usage

### Adding Events

#### 1. Text Input
```
"AI hackathon tomorrow at 2 PM online"
"React conference next Friday morning"
"Blockchain workshop December 15th"
```

#### 2. Voice Input
1. Click the 🎤 Voice button
2. Speak your event naturally
3. Watch it appear in the input field

#### 3. Image Upload
1. Click the 📷 Image button
2. Upload an event poster or screenshot
3. OCR will extract event details automatically

## 🎯 Key Features Demo

### AI Parsing Examples
- **Input**: "React hackathon tomorrow at 3 PM"
- **Output**:
  - Title: "React hackathon"
  - Date: 2024-07-05 (tomorrow)
  - Time: 15:00
  - Type: hackathon
  - Confidence: 95%

### Voice Recognition
- Supports natural speech patterns
- Real-time transcript display
- Error handling and fallbacks
- Multi-language support (configurable)

### OCR Capabilities
- Extracts text from event posters
- Identifies dates, times, locations
- Handles various image formats
- Processes screenshots and photos

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── BasicCalendar.tsx
│   ├── EventFeed.tsx
│   └── NotificationCenter.tsx
├── hooks/              # Custom React hooks
│   └── useVoiceInput.ts
├── services/           # Business logic services
│   ├── eventFeedService.ts
│   ├── notificationService.ts
│   └── recommendationService.ts
├── utils/              # Utility functions
│   └── eventParser.ts
└── index.css          # Global styles
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request


## �📄 License

This project is currently not licensed. All rights reserved to the author.

## 🙏 Acknowledgments

- **Tesseract.js** for OCR capabilities
- **Web Speech API** for voice recognition
- **React Team** for the amazing framework
- **Vite Team** for the lightning-fast build tool

---

**Made with ❤️ by [Debsmit Ghosh](https://github.com/Debsmit16) for the tech community**

*SmartTech Calendar - Where AI meets productivity*

## 🌟 Show Your Support

If you found this project helpful, please consider:
- ⭐ Starring this repository
- 🍴 Forking it for your own projects
- 📢 Sharing it with the community
- 🐛 Reporting issues or suggesting improvements

**© 2024 Debsmit Ghosh. All rights reserved.**
