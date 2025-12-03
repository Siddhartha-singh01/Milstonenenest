# Firebase Authentication Setup Guide

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project

## Step 2: Enable Authentication Methods

1. In your Firebase project, go to **Build** → **Authentication**
2. Click on the **Sign-in method** tab
3. Enable the following providers:
   - **Email/Password**: Click on it, toggle "Enable", and save
   - **Google**: Click on it, toggle "Enable", provide a support email, and save

## Step 3: Register Your Web App

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click the **Web** icon (`</>`)
4. Register your app with a nickname (e.g., "Milestonenest Web")
5. You'll receive a configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Step 4: Update Your Configuration File

1. Open `src/config/firebase.js`
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",              // Replace this
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",  // Replace this
  projectId: "YOUR_PROJECT_ID",        // Replace this
  storageBucket: "YOUR_PROJECT_ID.appspot.com",  // Replace this
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",  // Replace this
  appId: "YOUR_APP_ID"                 // Replace this
};
```

## Step 5: Configure Authorized Domains

1. In Firebase Console, go to **Authentication** → **Settings** → **Authorized domains**
2. Add your development domain (usually `localhost` is already there)
3. When deploying, add your production domain

## What You Need from Firebase Console

From the Firebase Console, you need to copy these 6 values:

1. **apiKey**: Your web API key
2. **authDomain**: Your project's auth domain (usually `projectId.firebaseapp.com`)
3. **projectId**: Your Firebase project ID
4. **storageBucket**: Your storage bucket URL
5. **messagingSenderId**: Your messaging sender ID
6. **appId**: Your web app ID

## Testing Your Setup

After updating the configuration:

1. Start your development server: `npm run dev`
2. Navigate to the login page
3. Try signing up with email/password
4. Try signing in with Google

## Troubleshooting

- **"Firebase: Error (auth/unauthorized-domain)"**: Add your domain to Authorized domains in Firebase Console
- **"Firebase: Error (auth/api-key-not-valid)"**: Check that your API key is correct
- **Google Sign-In not working**: Ensure Google provider is enabled and you've provided a support email

## Security Notes

- Never commit your Firebase config to public repositories if it contains sensitive data
- Use environment variables for production deployments
- Enable App Check for additional security in production
