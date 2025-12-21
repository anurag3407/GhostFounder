# GhostFounder - Phase 1 Implementation

## 🎨 Overview

GhostFounder is an AI-powered multi-agent platform that helps startup founders grow their ventures through specialized AI agents. This Phase 1 implementation includes the foundation and authentication layer.

## ✅ Phase 1 Completed Features

### Landing Page
- **Hero Section** with animated particle background (SparklesCore)
- **TextGenerateEffect** for dynamic tagline animation
- **FlipWords** component showing rotating agent names
- **BentoGrid** featuring all 8 AI agents with meteor effects
- **Floating Navigation** with tooltips for quick access
- **Responsive Navbar** with glassmorphism effect
- **Footer** with social links and legal pages

### Authentication
- Firebase Authentication (Email/Password + Google OAuth)
- Password Reset functionality
- Protected Routes with loading states
- Session persistence

### Dashboard
- Responsive sidebar with agent navigation
- Agent status cards with spotlight effects
- Token usage tracking (placeholder)
- GitHub connection prompt
- User profile display

### UI Components (Aceternity-inspired)
- `SparklesCore` - Animated particle background
- `TextGenerateEffect` - Typewriter text animation
- `FlipWords` - Rotating text with transitions
- `BentoGrid` - Feature grid layout
- `MovingBorder` - Animated border button
- `CardSpotlight` - Spotlight hover effect
- `Meteors` - Meteor shower animation

## 🎨 Design Theme

- **Primary Color**: Neon Blue (#00d4ff)
- **Accent Color**: Golden (#ffd700)
- **Success Color**: Neon Green (#00ff88)
- **Error Color**: Pink/Red (#ff3366)
- **Background**: Dark (#0a0a0f)
- **No purple/violet colors used**

## 📁 Project Structure

```
ghostfounder/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.js
│   │   │   ├── signup/page.js
│   │   │   └── layout.js
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/page.js
│   │   │   └── layout.js
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js (landing)
│   ├── components/
│   │   ├── landing/
│   │   │   ├── Hero.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── index.js
│   │   ├── ui/
│   │   │   ├── sparkles.jsx
│   │   │   ├── text-generate-effect.jsx
│   │   │   ├── flip-words.jsx
│   │   │   ├── bento-grid.jsx
│   │   │   ├── moving-border.jsx
│   │   │   ├── card-spotlight.jsx
│   │   │   └── meteors.jsx
│   │   └── ProtectedRoute.js
│   ├── context/
│   │   └── AuthContext.js
│   └── lib/
│       ├── firebase/
│       │   └── config.js
│       └── utils.js
├── .env.example
├── jsconfig.json
├── package.json
└── README_PHASE1.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Firebase project
- npm or yarn

### Installation

1. **Clone and install dependencies**
   ```bash
   cd ghostfounder
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then fill in your Firebase credentials.

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Firebase Setup

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication with Email/Password and Google providers
3. Copy your Firebase config to `.env.local`

## 📦 Dependencies

### Production
- `next` - React framework
- `react` / `react-dom` - React library
- `firebase` - Authentication
- `framer-motion` - Animations
- `@tabler/icons-react` - Icon library
- `clsx` - Class utilities
- `tailwind-merge` - Tailwind class merging

### Development
- `tailwindcss` - Styling
- `eslint` - Linting
- `postcss` - CSS processing

## 🔮 Next Steps (Phase 2)

- [ ] MongoDB integration with user model
- [ ] GitHub OAuth for repository access
- [ ] Phantom Code Guardian agent implementation
- [ ] Data Specter (Database Query Agent)
- [ ] LangGraph workflow setup
- [ ] Gemini 2.5+ integration

## 📄 License

MIT License - See LICENSE file for details
