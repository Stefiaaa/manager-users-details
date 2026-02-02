# Google Apps Script Setup Guide

This guide will help you set up Google Apps Script to manage sheet access without domain policy issues.

## ✅ Why Use Apps Script?

- ✅ Runs with YOUR @elblearning.com account permissions
- ✅ No domain policy restrictions
- ✅ No need for service accounts in your organization
- ✅ Simple setup process

## 📋 Step-by-Step Setup

### Step 1: Create Apps Script Project

1. Go to: **https://script.google.com**
2. Sign in with your **@elblearning.com** account
3. Click **"New Project"** (or the **"+"** button)

### Step 2: Paste the Code

1. Open the file: `google-apps-script-code.js` in this folder
2. Copy **ALL** the code
3. In Apps Script editor, delete the default `myFunction()` code
4. Paste the copied code

### Step 3: Deploy as Web App

1. Click **"Deploy"** → **"New deployment"**
2. Click the **gear icon** (⚙️) next to "Select type"
3. Choose **"Web app"**
4. Fill in:
   - **Description**: "Sheet Access Manager"
   - **Execute as**: **"Me"** (your @elblearning.com account) ⚠️ IMPORTANT
   - **Who has access**: **"Anyone"** (or "Anyone with Google account")
5. Click **"Deploy"**
6. **Authorize** the script when prompted:
   - Click "Review permissions"
   - Choose your @elblearning.com account
   - Click "Advanced" → "Go to [Project Name] (unsafe)"
   - Click "Allow"

### Step 4: Copy the Web App URL

1. After deployment, you'll see a **Web App URL**
2. It looks like: `https://script.google.com/macros/s/AKfycbz.../exec`
3. **Copy this URL**

### Step 5: Update setupProxy.js

1. Open: `src/setupProxy.js`
2. Find: `GOOGLE_APPS_SCRIPT_WEB_APP_URL`
3. Paste your Web App URL:
   ```javascript
   const GOOGLE_APPS_SCRIPT_WEB_APP_URL = 'YOUR_WEB_APP_URL_HERE';
   ```

### Step 6: Test It!

1. Restart your server: `npm run dev`
2. Edit a user in the app
3. Check the console logs - you should see:
   ```
   📜 Using Google Apps Script Web App...
   ✅ Sheet access updated via Apps Script
   ```

## 🔒 Security Notes

- The script runs with **YOUR** account permissions
- Make sure you have access to all stakeholder spreadsheets
- The script only modifies permissions you already have access to
- Keep the Web App URL private (don't commit it to public repos)

## 🐛 Troubleshooting

### "Script not found" error
- Make sure you copied the entire Web App URL
- Check that the deployment is active

### "Permission denied" error
- Make sure you authorized the script with your @elblearning.com account
- Verify you have access to the spreadsheets

### "Execution failed" error
- Check the Apps Script execution log:
  - In Apps Script editor → "Executions" (left menu)
  - Look for error details

## ✅ Done!

Once configured, sheet access will work automatically when you edit users in the app!

