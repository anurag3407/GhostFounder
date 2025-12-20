# Authentication Migration to Next.js

## Overview
The authentication system has been successfully migrated from React (Vite) to Next.js (App Router).

## Changes Made

### 1. **Dependencies**
- Installed `firebase` in the Next.js project.

### 2. **Environment Variables**
- Created `.env.local` with `NEXT_PUBLIC_` prefix for Firebase config variables.
- **Action Required**: Ensure you have the correct values in `.env.local`.

### 3. **Firebase Configuration**
- Created `lib/firebase.js` to initialize Firebase.
- Uses `process.env.NEXT_PUBLIC_...` to access environment variables.

### 4. **Auth Context**
- Created `context/AuthContext.js`.
- Added `"use client"` directive since it uses React hooks (`useState`, `useEffect`, `useContext`).
- Logic remains the same as the React version.

### 5. **Protected Route Component**
- Created `components/ProtectedRoute.js`.
- Uses `useRouter` from `next/navigation` for redirects.
- Wraps protected content and redirects to `/login` if not authenticated.

### 6. **Pages Migration**
- **Login Page**: `app/login/page.js`
  - Adapted from `Login.jsx`.
  - Uses `next/link` instead of `react-router-dom`'s `Link`.
  - Uses `useRouter` for navigation.
  - Added `"use client"`.
- **Register Page**: `app/register/page.js`
  - Adapted from `Register.jsx`.
  - Similar changes as Login page.
- **Home Page**: `app/page.js`
  - Adapted from `home.jsx`.
  - Wrapped with `ProtectedRoute` component.
  - Uses `useRouter` for logout redirect.

### 7. **Layout Integration**
- Updated `app/layout.tsx` to wrap the application with `AuthProvider`.

## How to Run
1. Navigate to the Next.js project directory: `cd ghostfounder`
2. Start the development server: `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000)

## Verification
- Visit `/` -> Should redirect to `/login`
- Visit `/login` -> Should see login form
- Login/Register -> Should redirect to `/`
- Logout -> Should redirect to `/login`
