# User Access Manager - Integration Setup Guide

This guide explains how to configure the User Access Manager to integrate with:
1. **Google Sheets** - Automatic stakeholder sheet access management
2. **Gmail Notifications** - Email notifications via Google Apps Script
3. **Slack** - Channel membership and notifications (already configured)

---

## Overview

The User Access Manager now provides centralized control for:

| Feature | Trigger | Action |
|---------|---------|--------|
| **Slack Channel** | Slack Notification enabled | User added to product's Slack channel |
| **Sheet Access** | Sheet Status = View/Edit | User granted access to stakeholder sheet |
| **Gmail** | Gmail Notification enabled | Email sent to user via Apps Script |

---

## 1. Google Sheets Integration Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click **Select a project** → **New Project**
3. Name it (e.g., "User Access Manager")
4. Click **Create**

### Step 2: Enable Required APIs

1. In your project, go to **APIs & Services** → **Library**
2. Search for and enable:
   - **Google Drive API**
   - **Google Sheets API** (optional, for future read/write operations)

### Step 3: Create a Service Account

1. Go to **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
3. Fill in:
   - Name: `user-access-manager`
   - ID: `user-access-manager`
4. Click **Create and Continue**
5. Grant role: **Editor** (or **Owner** for full access)
6. Click **Continue** → **Done**

### Step 4: Generate Service Account Key

1. Click on the created service account
2. Go to **Keys** tab
3. Click **Add Key** → **Create new key**
4. Select **JSON** format
5. Click **Create** - the key file will download

### Step 5: Share Your Spreadsheets

For each product's stakeholder sheet:

1. Open the Google Sheet
2. Click **Share** button
3. Add the service account email (from the JSON key file, e.g., `user-access-manager@project-id.iam.gserviceaccount.com`)
4. Grant **Editor** access
5. Click **Share**

### Step 6: Configure setupProxy.js

Open `src/setupProxy.js` and update:

```javascript
// Add your service account credentials
const GOOGLE_SERVICE_ACCOUNT = {
  client_email: 'user-access-manager@your-project.iam.gserviceaccount.com',
  private_key: '-----BEGIN PRIVATE KEY-----\n...your private key...\n-----END PRIVATE KEY-----\n',
};

// Add spreadsheet IDs for each product
const PRODUCT_SPREADSHEETS = {
  'MicroBuilder': 'YOUR_SPREADSHEET_ID_HERE',
  'Lectora Online': 'YOUR_SPREADSHEET_ID_HERE',
  // ... add for each product
};
```

To get a Spreadsheet ID:
- Open the Google Sheet
- The URL format is: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
- Copy the `SPREADSHEET_ID` portion

### Step 7: Update googleSheetsConfig.ts

Open `src/config/googleSheetsConfig.ts` and add the same spreadsheet IDs:

```typescript
export const PRODUCT_SHEETS: Record<string, ProductSheetConfig> = {
  'MicroBuilder': {
    productName: 'MicroBuilder',
    spreadsheetId: 'YOUR_SPREADSHEET_ID_HERE',
    spreadsheetName: 'MicroBuilder Stakeholder Feedback',
    spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID_HERE/edit',
  },
  // ... repeat for each product
};
```

---

## 2. Gmail Notification Setup (Google Apps Script)

### Step 1: Create Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click **New Project**
3. Name it (e.g., "User Access Manager Email Service")

### Step 2: Add the Script Code

Copy the code from `scripts/GoogleAppsScript_EmailNotification.gs` and paste it into the Apps Script editor.

### Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Configure:
   - **Description**: "Email Notification Service"
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. Click **Authorize access** and grant permissions
6. Copy the **Web App URL**

### Step 4: Configure setupProxy.js

Open `src/setupProxy.js` and add the Web App URL:

```javascript
const GMAIL_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

### Step 5: Test the Integration

Run the test function in Apps Script:

1. In the Apps Script editor, select `testSendEmail` from the dropdown
2. Update the test email address in the function
3. Click **Run**
4. Check your email for the test message

---

## 3. Slack Integration (Configured via Environment Variables)

The Slack integration reads tokens from environment variables. Verify the configuration in `src/setupProxy.js`:

```javascript
const PRODUCT_CONFIG = {
  'MicroBuilder': {
    botToken: process.env.SLACK_BOT_TOKEN_MICROBUILDER,
    channelName: 'elb-microbuilder-feedback',
    channelId: 'C...',
    webhookToken: process.env.SLACK_WEBHOOK_TOKEN_MICROBUILDER,
  },
  // ... other products
};
```

### To Get a Channel ID:
1. Open Slack
2. Right-click on the channel
3. Click **View channel details**
4. Scroll down to find the Channel ID (starts with C)

---

## How It Works

### When Adding a New User:

1. **Manager enables Sheet Status (View/Edit)**
   - Google Drive API grants the user read/write access to the product's stakeholder sheet

2. **Manager enables Slack Notification**
   - User is added to the product's Slack channel
   - Notification posted to the channel (if webhooks enabled)

3. **Manager enables Gmail Notification**
   - Email is sent to the user via Google Apps Script
   - Email includes access level, product info, and admin details

### When Updating a User:

- If **Sheet Status changes**: Access level is updated on the Google Sheet
- If **Product changes**: User is moved to the new product's sheet/channel
- If **Notifications are toggled**: Appropriate notifications are sent

### When Revoking Access:

- Sheet access is removed
- User is removed from Slack channel
- Revocation notification is sent (if enabled)

---

## Troubleshooting

### Google Sheets Access Not Working

1. **Check console logs** - Look for error messages starting with `❌`
2. **Verify service account email** - Make sure sheets are shared with the service account
3. **Check private key format** - Ensure `\n` newlines are preserved in the key
4. **Verify spreadsheet ID** - Double-check the ID from the sheet URL

### Gmail Notifications Not Sending

1. **Check Apps Script logs** - In Apps Script, go to Executions to see logs
2. **Verify Web App URL** - Ensure the URL is correct in setupProxy.js
3. **Test directly** - Run the `testSendEmail` function in Apps Script
4. **Check permissions** - Re-authorize the Apps Script if needed

### Slack Channel Operations Failing

1. **Verify bot token** - Ensure the bot token has required scopes
2. **Check channel ID** - Confirm the channel ID is correct
3. **Verify bot membership** - The bot must be a member of the channel
4. **Check user email** - User must exist in the Slack workspace

---

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit credentials to version control**
   - Consider using environment variables
   - Add `setupProxy.js` to `.gitignore` if it contains credentials

2. **Service Account Security**
   - Store the JSON key file securely
   - Rotate keys periodically
   - Only grant necessary permissions

3. **Apps Script Security**
   - The Apps Script runs under your Google account
   - Consider creating a dedicated service account

---

## Configuration Checklist

- [ ] Google Cloud Project created
- [ ] Google Drive API enabled
- [ ] Service Account created with key
- [ ] Stakeholder sheets shared with service account
- [ ] Spreadsheet IDs added to setupProxy.js
- [ ] Spreadsheet IDs added to googleSheetsConfig.ts
- [ ] Google Apps Script created and deployed
- [ ] Apps Script URL added to setupProxy.js
- [ ] Slack channel IDs verified
- [ ] Integration tested end-to-end

---

## Support

For issues or questions:
1. Check the browser console for frontend errors
2. Check the terminal (where the server is running) for backend logs
3. Review the troubleshooting section above

