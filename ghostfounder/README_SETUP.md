# GhostFounder Setup Guide

Complete guide to setting up GhostFounder development environment.

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm/yarn**: Latest version
- **Git**: For version control
- **MongoDB Atlas Account**: For database
- **Firebase Account**: For authentication
- **Google Cloud Account**: For Gemini AI API
- **GitHub OAuth App**: For GitHub integration
- **Twilio Account** (Optional): For WhatsApp notifications
- **Google Cloud Service Account** (Optional): For Sheets integration

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/ghostfounder.git
cd ghostfounder/ghostfounder

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start development server
npm run dev
```

## Environment Variables

Create a `.env.local` file in the `ghostfounder` directory:

```env
# ===================
# REQUIRED VARIABLES
# ===================

# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ghostfounder?retryWrites=true&w=majority

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Gemini AI
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy...

# GitHub OAuth
GITHUB_CLIENT_ID=Iv1.xxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxx

# ===================
# OPTIONAL VARIABLES
# ===================

# Twilio (WhatsApp notifications)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=+14155238886

# Google Sheets Integration
GOOGLE_SERVICE_ACCOUNT_EMAIL=service@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms

# Blockchain/Web3
NEXT_PUBLIC_ALCHEMY_API_KEY=xxxxx
NEXT_PUBLIC_ETHERSCAN_API_KEY=xxxxx

# Vercel Cron (Production only)
CRON_SECRET=your-random-secret-string
```

## Service Setup Instructions

### 1. MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster (free tier available)
4. Click "Connect" on your cluster
5. Choose "Connect your application"
6. Copy the connection string
7. Replace `<password>` with your database user password
8. Add to `.env.local` as `MONGODB_URI`

**Network Access:**
- Go to Network Access → Add IP Address
- Add `0.0.0.0/0` for development (restrict for production)

**Database User:**
- Go to Database Access → Add New Database User
- Create user with read/write permissions

### 2. Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication:
   - Go to Build → Authentication
   - Click "Get Started"
   - Enable Email/Password provider
   - Enable Google provider

4. Get config values:
   - Go to Project Settings → General
   - Scroll to "Your apps" → Add web app
   - Copy the config object values

**Firebase Config Example:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",           // NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "xxx.firebaseapp.com",  // NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "xxx",              // NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "xxx.appspot.com",   // NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123...",   // NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123:web:abc"         // NEXT_PUBLIC_FIREBASE_APP_ID
};
```

### 3. Google Gemini AI

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API Key"
3. Create a new API key or use existing
4. Copy the API key to `NEXT_PUBLIC_GEMINI_API_KEY`

**Enable Models:**
- Gemini 2.5 Flash (default, faster)
- Gemini 2.5 Pro (optional, more capable)

### 4. GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in the details:
   - **Application name**: GhostFounder
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/github/callback`
4. Click "Register application"
5. Copy Client ID to `GITHUB_CLIENT_ID`
6. Generate a new client secret and copy to `GITHUB_CLIENT_SECRET`

**Production URLs:**
Update callback URL to your production domain when deploying.

### 5. Twilio WhatsApp (Optional)

1. Go to [Twilio Console](https://www.twilio.com/console)
2. Create account and verify phone number
3. Go to Messaging → Try it out → Send a WhatsApp message
4. Follow sandbox setup instructions
5. Get credentials:
   - Account SID from dashboard
   - Auth Token from dashboard
   - WhatsApp number (sandbox: `+14155238886`)

**Testing:**
Users must join sandbox by sending "join <code>" to the WhatsApp number.

### 6. Google Sheets Integration (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Sheets API:
   - APIs & Services → Library → Search "Google Sheets API"
   - Click Enable
4. Create Service Account:
   - APIs & Services → Credentials
   - Create Credentials → Service Account
   - Download JSON key file
5. Share your Google Sheet:
   - Share with the service account email
   - Give "Editor" access
6. Get Spreadsheet ID:
   - Open your Google Sheet
   - Copy ID from URL: `docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`

### 7. Blockchain APIs (Optional)

**Alchemy (Ethereum Node):**
1. Go to [Alchemy](https://www.alchemy.com/)
2. Create free account
3. Create new app (Ethereum Mainnet)
4. Copy API key

**Etherscan (Blockchain Explorer):**
1. Go to [Etherscan](https://etherscan.io/apis)
2. Create free account
3. Create API key

## Database Models

GhostFounder uses the following MongoDB collections:

| Collection | Description |
|------------|-------------|
| `users` | User profiles and settings |
| `usergithubdatas` | GitHub analysis results |
| `investoroutreaches` | VC outreach drafts |
| `ghostguruadvices` | AI coaching sessions |
| `marketvalidations` | Market research data |
| `pitchdecks` | Generated pitch decks |
| `competitoranalyses` | Competitor intelligence |
| `newsdigestsummaries` | Daily news summaries |
| `investorprofiles` | VC/investor data |
| `agenterrors` | Error logs |

## Running the Application

### Development

```bash
# Start development server
npm run dev

# With specific port
npm run dev -- -p 3001

# Build for production
npm run build

# Start production server
npm start
```

### Accessing the App

- **Landing Page**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register
- **Dashboard**: http://localhost:3000/dashboard

## Testing Your Setup

### 1. Test MongoDB Connection

```javascript
// In browser console or test file
fetch('/api/agents/ghost-guru', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: 'test', message: 'Hello' })
})
```

### 2. Test Firebase Auth

1. Navigate to /register
2. Create a test account
3. Verify email/password login works

### 3. Test GitHub OAuth

1. Go to Settings page
2. Click "Connect GitHub"
3. Authorize the application
4. Verify repository list appears

### 4. Test Gemini AI

1. Go to Dashboard
2. Open GhostGuru chat
3. Send a test message
4. Verify AI responds

## Troubleshooting

### Common Issues

**MongoDB Connection Failed:**
```
Error: MongoServerError: bad auth
```
- Check username/password in connection string
- Verify IP whitelist in Atlas

**Firebase Auth Error:**
```
Error: auth/configuration-not-found
```
- Verify all Firebase config values are set
- Check if authentication is enabled in Firebase Console

**GitHub OAuth Error:**
```
Error: redirect_uri_mismatch
```
- Verify callback URL matches exactly
- Include trailing slashes consistently

**Gemini API Error:**
```
Error: 403 API key not valid
```
- Check API key is correct
- Verify Gemini API is enabled in Google Cloud

### Debug Mode

Add to `.env.local`:
```env
NEXT_PUBLIC_DEBUG_MODE=true
```

This enables verbose logging in the console.

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Configure environment variables
5. Deploy

**Production Environment Variables:**
Set all variables from `.env.local` in Vercel dashboard.

### Alternative Platforms

- **Netlify**: Supports Next.js with adapter
- **Railway**: Simple container deployment
- **Docker**: Use included Dockerfile (create one)

## Security Checklist

- [ ] Never commit `.env.local` to git
- [ ] Use strong CRON_SECRET in production
- [ ] Restrict MongoDB IP whitelist
- [ ] Enable Firebase App Check
- [ ] Set up rate limiting for APIs
- [ ] Review GitHub OAuth scopes
- [ ] Use HTTPS in production

## Support

For issues and questions:
1. Check existing GitHub Issues
2. Review error logs in console
3. Verify environment variables are set
4. Test each service independently

## Next Steps

After setup:
1. Complete user registration
2. Connect GitHub account
3. Explore all 8 AI agents
4. Configure notification preferences
5. Set up blockchain wallet (optional)
