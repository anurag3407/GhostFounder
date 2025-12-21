# GhostFounder - Phase 3 Documentation

## 🎭 Phase 3: Advanced AI Agents

Phase 3 introduces four new specialized AI agents designed to supercharge your startup journey with intelligent automation for pitch creation, competitive intelligence, news aggregation, and investor feedback.

---

## 🆕 New Agents

### 1. Pitch Poltergeist 🎭
**AI-Powered Pitch Deck Generator**

Automatically generates investor-ready pitch decks by analyzing your GitHub repository and project data.

**Features:**
- GitHub repository analysis for tech stack insights
- Market size estimation using AI
- Competition research and positioning
- Financial projections generation
- 10-slide investor-ready PDF deck

**API Endpoints:**
```
POST /api/agents/pitch-poltergeist
GET  /api/agents/pitch-poltergeist?userId=<uid>
GET  /api/agents/pitch-poltergeist?userId=<uid>&deckId=<id>
```

**Dashboard:** `/agents/pitch-poltergeist`

---

### 2. Shadow Scout 👁️
**Competitive Intelligence & Weekly Spy Reports**

Monitors your competitors and generates comprehensive market intelligence reports.

**Features:**
- Automated competitor discovery
- GitHub activity monitoring
- Market trend analysis
- Weekly PDF spy reports
- Threat level assessment

**API Endpoints:**
```
POST /api/agents/shadow-scout
GET  /api/agents/shadow-scout?userId=<uid>
GET  /api/agents/shadow-scout?userId=<uid>&reportId=<id>
```

**Dashboard:** `/agents/shadow-scout`

**Cron Job:** `POST /api/cron/weekly-spy`
- Runs weekly on Mondays at 6:00 AM UTC
- Generates reports for all active user projects

---

### 3. News Banshee 📰
**Daily Startup & Tech News Aggregator**

Curates and summarizes relevant startup, technology, and funding news daily.

**Features:**
- Multi-source news aggregation (NewsAPI)
- AI-powered categorization
- Relevance scoring for startups
- Personalized keyword filtering
- Save articles for later

**API Endpoints:**
```
POST /api/agents/news-banshee
GET  /api/agents/news-banshee?userId=<uid>
GET  /api/agents/news-banshee?userId=<uid>&category=<cat>&limit=<n>
```

**Dashboard:** `/agents/news-banshee`

**Cron Job:** `POST /api/cron/daily-news`
- Runs daily at 8:00 AM UTC
- Fetches fresh news for all active users

---

### 4. Investor Ghoul 💀
**VC Roast Mode - Harsh But Constructive Feedback**

Provides tough, realistic VC-style feedback on your startup ideas.

**Features:**
- Three roast intensities (Constructive, Standard, Brutal)
- Scoring system (0-100)
- Investment verdict (Invest/Pass/Maybe)
- Strengths and weaknesses analysis
- Daily tough love motivation quotes
- Random WhatsApp motivation (optional)

**API Endpoints:**
```
POST /api/agents/investor-ghoul
GET  /api/agents/investor-ghoul?userId=<uid>&action=motivation
GET  /api/agents/investor-ghoul?userId=<uid>
```

**Dashboard:** `/agents/investor-ghoul`

---

## 📁 New Files Created

### Agent Core Files
```
src/lib/agents/
├── pitch-poltergeist.js    # Pitch deck generation
├── shadow-scout.js         # Competitive intelligence
├── news-banshee.js         # News aggregation
└── investor-ghoul.js       # VC roast mode
```

### API Routes
```
src/app/api/agents/
├── pitch-poltergeist/route.js
├── shadow-scout/route.js
├── news-banshee/route.js
└── investor-ghoul/route.js

src/app/api/cron/
├── daily-news/route.js
└── weekly-spy/route.js
```

### Dashboard Pages
```
src/app/(dashboard)/agents/
├── pitch-poltergeist/page.js
├── shadow-scout/page.js
├── news-banshee/page.js
└── investor-ghoul/page.js
```

---

## 🔧 Environment Variables

Add these to your `.env.local`:

```env
# Existing (from Phase 1 & 2)
MONGODB_URI=mongodb+srv://...
GEMINI_API_KEY=your_gemini_api_key

# New for Phase 3
NEWS_API_KEY=your_newsapi_key            # From newsapi.org
CRON_SECRET=your_random_secret_string    # For securing cron endpoints
TWILIO_ACCOUNT_SID=your_twilio_sid       # Optional: WhatsApp notifications
TWILIO_AUTH_TOKEN=your_twilio_token      # Optional: WhatsApp notifications
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886  # Optional: Twilio WhatsApp number
```

---

## 📦 New Dependencies

Phase 3 added the following packages:

```json
{
  "pdf-lib": "^1.17.1",  // PDF generation for pitch decks & reports
  "axios": "^1.7.9"      // HTTP client for news APIs
}
```

---

## 🚀 Cron Job Setup

### Vercel Cron

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-news",
      "schedule": "0 8 * * *"
    },
    {
      "path": "/api/cron/weekly-spy",
      "schedule": "0 6 * * 1"
    }
  ]
}
```

### Manual Testing

```bash
# Test daily news cron
curl -X POST http://localhost:3000/api/cron/daily-news \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Test weekly spy cron
curl -X POST http://localhost:3000/api/cron/weekly-spy \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## 🎨 UI Components

### Design System
- **Pitch Poltergeist:** Gold theme (#ffd700)
- **Shadow Scout:** Blue theme (#00d4ff)
- **News Banshee:** Neon Green theme (#00ff88)
- **Investor Ghoul:** Red theme (danger/roast)

### Animations
- Framer Motion for page transitions
- Loading spinners during AI generation
- Card hover effects
- Slide-in panels for details

---

## 🔒 Security Notes

1. **Cron Authentication:** All cron endpoints require `CRON_SECRET` bearer token
2. **User Isolation:** All data is scoped to `userId`
3. **Rate Limiting:** Consider adding rate limits for AI-heavy endpoints
4. **API Keys:** Never expose API keys to the client

---

## 📊 Data Models

Phase 3 agents store data in MongoDB collections:

| Collection | Agent | Purpose |
|------------|-------|---------|
| `pitchdecks` | Pitch Poltergeist | Generated decks |
| `competitorreports` | Shadow Scout | Spy reports |
| `newsarticles` | News Banshee | Aggregated news |
| `pitchroasts` | Investor Ghoul | Roast history |

---

## 🧪 Testing the Agents

### 1. Pitch Poltergeist
1. Navigate to `/agents/pitch-poltergeist`
2. Enter project details (GitHub URL optional)
3. Click "Generate Pitch Deck"
4. Download PDF when ready

### 2. Shadow Scout
1. Navigate to `/agents/shadow-scout`
2. Click "New Spy Report"
3. Describe your project and industry
4. Add known competitors (optional)
5. Generate and download report

### 3. News Banshee
1. Navigate to `/agents/news-banshee`
2. Click "Refresh News" to fetch articles
3. Filter by category or search
4. Save articles for later reading

### 4. Investor Ghoul
1. Navigate to `/agents/investor-ghoul`
2. Select roast intensity
3. Enter your startup idea
4. Submit and receive feedback
5. Check roast history

---

## 🐛 Troubleshooting

### Common Issues

1. **"Failed to generate pitch deck"**
   - Check `GEMINI_API_KEY` is valid
   - Ensure project description is provided

2. **"News not loading"**
   - Verify `NEWS_API_KEY` from newsapi.org
   - Check API rate limits (free tier: 100 requests/day)

3. **"Cron job unauthorized"**
   - Ensure `CRON_SECRET` matches in request header
   - Check Vercel cron configuration

4. **"WhatsApp not sending"**
   - Twilio credentials are optional
   - Verify Twilio account and WhatsApp sandbox

---

## ✅ Phase 3 Checklist

- [x] Pitch Poltergeist agent
- [x] Shadow Scout agent
- [x] News Banshee agent
- [x] Investor Ghoul agent
- [x] API routes for all agents
- [x] Cron job endpoints
- [x] Dashboard pages
- [x] Sidebar navigation
- [x] Documentation

---

## 🔮 What's Next: Phase 4

Phase 4 will introduce:
- Voice Specter (voice interaction)
- Integration Hub
- Advanced Analytics Dashboard
- Multi-agent Orchestration

---

*GhostFounder - Your AI Co-founder That Never Sleeps* 👻
