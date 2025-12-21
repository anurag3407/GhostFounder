# GhostFounder - Phase 2 Implementation

## 🎭 Overview

Phase 2 introduces the core AI agent infrastructure with four powerful agents:

1. **Phantom Code Guardian** - Autonomous code reviewer
2. **Data Specter** - Natural language database queries
3. **Treasury Wraith** - AI-powered CFO & financial analysis
4. **Equity Phantom** - Blockchain equity management

## 🏗️ Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── agents/
│   │   │   ├── code-guardian/route.js
│   │   │   ├── data-specter/route.js
│   │   │   ├── treasury-wraith/route.js
│   │   │   └── equity-phantom/route.js
│   │   └── github/
│   │       ├── authorize/route.js
│   │       ├── callback/route.js
│   │       └── webhook/route.js
│   └── (dashboard)/
│       └── agents/
│           ├── code-guardian/page.js
│           ├── data-specter/page.js
│           ├── treasury-wraith/page.js
│           └── equity-phantom/page.js
├── lib/
│   ├── agents/
│   │   ├── base-agent.js
│   │   ├── phantom-code-guardian.js
│   │   ├── data-specter.js
│   │   ├── treasury-wraith.js
│   │   ├── equity-phantom.js
│   │   └── index.js
│   ├── gemini/
│   │   └── config.js
│   ├── mongodb/
│   │   └── connect.js
│   └── notifications/
│       └── index.js
└── models/
    ├── User.js
    ├── CodeReview.js
    ├── ChatMessage.js
    ├── FinancialReport.js
    └── index.js
```

## 🔧 Environment Variables

Add these to your `.env.local` file:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://your-connection-string

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# GitHub OAuth (for Code Guardian)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=http://localhost:3000/api/github/callback
GITHUB_WEBHOOK_SECRET=your-webhook-secret

# Email Notifications (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=GhostFounder <noreply@ghostfounder.com>

# WhatsApp Notifications (Twilio)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Google Sheets (Treasury Wraith)
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Ethereum (Equity Phantom)
ETHEREUM_NETWORK=sepolia
INFURA_PROJECT_ID=your-infura-project-id
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/your-project-id
```

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up MongoDB

Create a MongoDB Atlas cluster and add the connection string to `.env.local`:
- Go to [MongoDB Atlas](https://cloud.mongodb.com)
- Create a free cluster
- Get your connection string
- Replace `<password>` and `<dbname>` in the URI

### 3. Set Up Gemini AI

Get your API key from [Google AI Studio](https://aistudio.google.com):
- Create a new API key
- Add it to `GEMINI_API_KEY`

### 4. Set Up GitHub OAuth (for Code Guardian)

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL to `http://localhost:3000/api/github/callback`
4. Copy Client ID and Client Secret

### 5. Set Up GitHub Webhook

1. In your repository, go to Settings → Webhooks
2. Add webhook with Payload URL: `https://your-domain.com/api/github/webhook`
3. Content type: `application/json`
4. Secret: Generate a secret and add to `GITHUB_WEBHOOK_SECRET`
5. Events: Select "Pull requests"

### 6. Set Up Google Sheets (for Treasury Wraith)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a service account
3. Enable Google Sheets API
4. Download the JSON key file
5. Copy `client_email` and `private_key` to env vars

### 7. Set Up Ethereum (for Equity Phantom)

1. Get an Infura account at [infura.io](https://infura.io)
2. Create a new project
3. Copy the Project ID
4. Get Sepolia testnet ETH from [Sepolia Faucet](https://sepoliafaucet.com)

## 👻 Agent Details

### Phantom Code Guardian

Automatically reviews pull requests when:
- A new PR is opened
- New commits are pushed to an existing PR
- A PR is reopened

Features:
- Code quality scoring (0-100)
- Security vulnerability detection
- Best practices analysis
- Automatic GitHub PR comments
- Email/WhatsApp notifications

### Data Specter

Natural language interface for database queries:
- Converts questions to MongoDB aggregation pipelines
- Maintains conversation context
- Schema-aware queries
- Safe query execution

Example queries:
- "Show me all users who signed up this month"
- "What's the average order value?"
- "Find the top 5 products by sales"

### Treasury Wraith

AI-powered CFO for financial analysis:
- Generates comprehensive financial reports
- Creates Google Sheets for data export
- Revenue/expense analysis
- Cash flow projections
- Actionable recommendations

### Equity Phantom

Blockchain-based equity management:
- ERC-20 token integration on Sepolia
- Real-time balance tracking
- Equity transfer execution
- Vesting schedule management
- AI-powered cap table analysis

## 📡 API Endpoints

### Code Guardian
```
GET  /api/agents/code-guardian          - Get code reviews
POST /api/agents/code-guardian/trigger  - Manually trigger review
```

### Data Specter
```
GET  /api/agents/data-specter  - Get chat history
POST /api/agents/data-specter  - Send query
```

### Treasury Wraith
```
GET  /api/agents/treasury-wraith  - Get reports
POST /api/agents/treasury-wraith  - Generate report
```

### Equity Phantom
```
GET  /api/agents/equity-phantom  - Get equity data
POST /api/agents/equity-phantom  - Execute operations
```

### GitHub
```
GET  /api/github/authorize  - Start OAuth flow
GET  /api/github/callback   - OAuth callback
POST /api/github/webhook    - Webhook handler
```

## 🧪 Testing

### Test Code Guardian
1. Connect GitHub from the dashboard
2. Create a pull request in a connected repo
3. Watch for automatic review comments

### Test Data Specter
1. Navigate to /agents/data-specter
2. Ask questions about your data
3. View generated queries and results

### Test Treasury Wraith
1. Navigate to /agents/treasury-wraith
2. Generate a financial report
3. View analysis and Google Sheet link

### Test Equity Phantom
1. Navigate to /agents/equity-phantom
2. View equity distribution
3. Run AI analysis on cap table

## 🔜 Coming in Phase 3

- Pitch Poltergeist (Deck Generator)
- Shadow Scout (Competitor Intel)
- News Banshee (Industry News)
- Investor Ghoul (VC Roast Mode)

## 📝 Notes

- All agents use Gemini 2.5 Flash for speed, with Pro available for complex analysis
- MongoDB is used for persistent storage of reviews, chats, and reports
- Notifications are optional - agents work without email/WhatsApp configured
- Equity Phantom uses Sepolia testnet - do not use with real funds
