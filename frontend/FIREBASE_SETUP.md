# 🔥 Firebase Setup Instructions

## ✅ Issues Resolved
- **Removed `dotenv` package** - Not needed in Vite (browser environment)
- **Using Vite's built-in env variable handling** - `import.meta.env.VITE_*`
- **Created `.env` file** - For your Firebase credentials
- **Updated `.gitignore`** - To prevent committing sensitive credentials

## 🚀 Next Steps: Configure Firebase

### 1. Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon ⚙️ next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. If you don't have a web app, click "Add app" and select Web (</>) icon
7. Copy the configuration values

### 2. Update Your `.env` File

Open `/Users/jarvis/GhostFounder/frontend/.env` and replace the placeholder values:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123
```

### 3. Enable Authentication Methods in Firebase

1. In Firebase Console, go to **Authentication** (in the left sidebar)
2. Click "Get Started" if you haven't set it up
3. Go to **Sign-in method** tab
4. Enable the following providers:
   - **Email/Password** - Click, toggle "Enable", and Save
   - **Google** - Click, toggle "Enable", provide support email, and Save

### 4. Restart Your Dev Server

After updating the `.env` file:
- Stop the current dev server (Ctrl+C)
- Run `npm run dev` again
- The server will pick up the new environment variables

## 🎯 Your App is Running

- **Dev Server**: http://localhost:5174/
- You should now see the Login page
- Try registering a new account or signing in with Google!

## 📝 Important Notes

- **Never commit `.env`** - It's already in `.gitignore`
- **Restart server** - Required after changing `.env` file
- **VITE_ prefix** - All env variables must start with `VITE_` to be exposed to the browser
- **Build process** - Env variables are embedded at build time

## 🐛 Troubleshooting

If you see Firebase errors:
1. Double-check all values in `.env` are correct
2. Ensure there are no extra spaces or quotes
3. Verify authentication methods are enabled in Firebase Console
4. Restart the dev server after any `.env` changes

## 🔒 Security Note

The `.env` file is ignored by git to keep your credentials safe. Share `.env.example` with your team instead, and have them create their own `.env` file with their credentials.
