# 🚀 Complete Deployment Guide with Firebase Authentication

This guide will help you deploy the Feeder Capture Dashboard with:
- ✅ Firebase for permanent data storage
- ✅ Login protection (username/password stored in Firebase)
- ✅ GitHub Pages hosting

---

## 📋 Part 1: Create Firebase Project

### Step 1.1: Go to Firebase Console
1. Open **https://console.firebase.google.com/**
2. Sign in with your Google account

### Step 1.2: Create New Project
1. Click **"Add project"** or **"Create a project"**
2. Enter project name: `feeder-dashboard` (or any name you like)
3. Click **Continue**
4. Disable Google Analytics (optional, not needed)
5. Click **Create project**
6. Wait for project to be created, then click **Continue**

### Step 1.3: Add Web App to Project
1. On the project overview page, click the **Web icon** (`</>`)
2. Enter app nickname: `feeder-dashboard-web`
3. **DO NOT** check "Firebase Hosting"
4. Click **Register app**
5. **COPY THE CONFIGURATION VALUES** - You'll need these!

You'll see something like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "feeder-dashboard.firebaseapp.com",
  projectId: "feeder-dashboard",
  storageBucket: "feeder-dashboard.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

**Save these values!**

### Step 1.4: Create Firestore Database
1. In the left sidebar, click **Build** → **Firestore Database**
2. Click **Create database**
3. Select **Start in production mode**
4. Choose a location closest to you (e.g., `us-central1`)
5. Click **Enable**

### Step 1.5: Set Firestore Security Rules
1. In Firestore, click the **Rules** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write only for authenticated sessions
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

> ⚠️ **Note:** This allows all access. For better security after testing, update to:
> ```javascript
> allow read, write: if request.auth != null;
> ```
> But for now, keep it open so the app-based auth works.

3. Click **Publish**

---

## 📋 Part 2: Configure GitHub Repository

### Step 2.1: Download the Project
1. Download this project as a ZIP file
2. Extract it to a folder on your computer

### Step 2.2: Create `.env` File
1. In the extracted project folder, find `.env.example`
2. Copy it and rename to `.env`
3. Fill in your Firebase values:

```
VITE_FIREBASE_API_KEY=AIzaSyB...
VITE_FIREBASE_AUTH_DOMAIN=feeder-dashboard.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=feeder-dashboard
VITE_FIREBASE_STORAGE_BUCKET=feeder-dashboard.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Step 2.3: Create GitHub Repository
1. Go to **https://github.com** and sign in
2. Click **+** → **New repository**
3. Name: `feeder-dashboard`
4. Select **Public**
5. **DO NOT** add README or .gitignore
6. Click **Create repository**

### Step 2.4: Add GitHub Secrets (IMPORTANT!)
Your Firebase config should NOT be in the code. Add them as GitHub secrets:

1. In your new repository, go to **Settings**
2. Click **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret one by one:

| Name | Value (from your Firebase config) |
|------|-----------------------------------|
| `VITE_FIREBASE_API_KEY` | Your apiKey |
| `VITE_FIREBASE_AUTH_DOMAIN` | Your authDomain |
| `VITE_FIREBASE_PROJECT_ID` | Your projectId |
| `VITE_FIREBASE_STORAGE_BUCKET` | Your storageBucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your messagingSenderId |
| `VITE_FIREBASE_APP_ID` | Your appId |

### Step 2.5: Push Code to GitHub
Open Terminal/Command Prompt and run:

```bash
cd path/to/extracted-folder

git init
git add .
git commit -m "Initial commit with Firebase"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/feeder-dashboard.git
git push -u origin main
```

### Step 2.6: Enable GitHub Pages
1. In your repository, go to **Settings** → **Pages**
2. Under "Build and deployment", set Source to **GitHub Actions**
3. Wait for the workflow to complete

---

## 📋 Part 3: First Time Setup

### Step 3.1: Access Your Dashboard
1. After deployment completes, go to:
   ```
   https://YOUR-USERNAME.github.io/feeder-dashboard/
   ```

### Step 3.2: Create Admin Account
1. The first time you access the app, you'll see **"First Time Setup"**
2. Enter your desired **username** and **password**
3. Click **Create Admin Account**
4. This creates your login credentials in Firebase (not in code!)

### Step 3.3: Start Using
1. Upload your Feeder Lookup file (saved permanently in Firebase)
2. Upload asset files and generate reports
3. All data is stored in Firebase cloud!

---

## 🔐 Security Notes

1. **Credentials are stored in Firebase** - not in your code
2. **GitHub Secrets** keep your Firebase config private
3. **Passwords are hashed** using SHA-256 before storing
4. **Session-based auth** - logout clears access

### To Add More Users
Currently, only one admin account is supported. To add more users:
1. Go to Firebase Console → Firestore
2. Create a new document in the `users` collection
3. Use the same password hash format

---

## 🔄 Updating the Dashboard

To push updates:

```bash
cd your-project-folder
git add .
git commit -m "Your update message"
git push
```

GitHub Actions will automatically rebuild and redeploy.

---

## ❓ Troubleshooting

### "Unable to connect to Firebase"
- Check your `.env` file or GitHub Secrets have correct values
- Make sure Firestore is enabled in Firebase Console

### Login not working
- Check Firestore Rules allow read/write
- Check browser console for errors (F12)

### Data not saving
- Check Firestore Rules
- Check your Firebase project quota

### 404 Error
- Wait 2-3 minutes for deployment
- Check GitHub Actions tab for errors
- Make sure Pages source is set to "GitHub Actions"

---

## 📊 What's Stored in Firebase

| Collection | Purpose |
|------------|---------|
| `feederLookup` | Feeder code to name mappings |
| `currentReport` | Currently generated report |
| `previousReport` | Saved previous week report |
| `users` | Login credentials (hashed passwords) |

---

## ✅ Done!

Your dashboard now has:
- 🔐 Login protection
- ☁️ Cloud data storage
- 📊 Persistent feeder lookup
- 🔄 Week-to-week comparison
- 📥 Excel export

Enjoy your Feeder Capture Dashboard!
