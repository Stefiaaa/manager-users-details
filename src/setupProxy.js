const https = require('https');
const nodemailer = require('nodemailer');

// Disable SSL verification for corporate networks with self-signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// ============================================
// GMAIL CONFIGURATION
// ============================================
// 
// Option 1: Use Google Apps Script (RECOMMENDED)
// Deploy your existing Apps Script as a Web App and paste the URL below
//
// Option 2: Use SMTP with App Password
// Get App Password from: https://myaccount.google.com/apppasswords
//

// Google Apps Script Configuration (RECOMMENDED)
// Your existing Apps Script Web App URL
const GMAIL_APPS_SCRIPT = {
  enabled: true,  // Set to true to use Apps Script
  webAppUrl: '',  // Add your deployed Apps Script Web App URL here
  // Example: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
};

// SMTP Configuration (Alternative)
const GMAIL_SMTP_CONFIG = {
  enabled: false,  // Set to true to use SMTP instead of Apps Script
  email: 'ithelpdesk.in@elblearning.com',
  appPassword: '',  // Get from: https://myaccount.google.com/apppasswords
  senderName: 'User Access Manager',
};

// Create nodemailer transporter (will be initialized when config is provided)
let emailTransporter = null;

function initEmailTransporter() {
  if (GMAIL_SMTP_CONFIG.email && GMAIL_SMTP_CONFIG.appPassword) {
    emailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_SMTP_CONFIG.email,
        pass: GMAIL_SMTP_CONFIG.appPassword,
      },
    });
    console.log('✅ Gmail SMTP transporter initialized');
    return true;
  }
  return false;
}

// ============================================
// SLACK CONFIGURATION - BOT TOKENS PER PRODUCT
// ============================================

// ⚠️ IMPORTANT: You need to get Channel IDs from Slack
// To get a Channel ID: Right-click channel → View channel details → Copy Channel ID (starts with C)
const PRODUCT_CONFIG = {
  'MicroBuilder': {
    botToken: process.env.SLACK_BOT_TOKEN_MICROBUILDER || '',
    channelName: 'elb-microbuilder-feedback',
    channelId: 'C0A5XCEF41Z', // Add channel ID here, e.g., 'C0123456789'
    webhookToken: process.env.SLACK_WEBHOOK_TOKEN_MICROBUILDER || '',
  },
  'Lectora Online': {
    botToken: process.env.SLACK_BOT_TOKEN_LECTORA_ONLINE || '',
    channelName: 'lectora-online-feedback',
    channelId: 'C0A3VKKSZRD', // Add channel ID here
    webhookToken: process.env.SLACK_WEBHOOK_TOKEN_LECTORA_ONLINE || '',
  },
  'Lectora Desktop': {
    botToken: process.env.SLACK_BOT_TOKEN_LECTORA_DESKTOP || '',
    channelName: 'lectora-desktop-feedback',
    channelId: 'C0A44MPH9B5', // Add channel ID here
    webhookToken: process.env.SLACK_WEBHOOK_TOKEN_LECTORA_DESKTOP || '',
  },
  'The Training Arcade': {
    botToken: process.env.SLACK_BOT_TOKEN_TRAINING_ARCADE || '',
    channelName: 'the-training-arcade-feedback',
    channelId: 'C0A4E2RK1M0', // Add channel ID here
    webhookToken: process.env.SLACK_WEBHOOK_TOKEN_TRAINING_ARCADE || '',
  },
  'Rehearsal & RolePlay': {
    botToken: process.env.SLACK_BOT_TOKEN_REHEARSAL_ROLEPLAY || '',
    channelName: 'rehearsal-roleplay-feedback',
    channelId: 'C0A4E7EL9EW', // Add channel ID here
    webhookToken: process.env.SLACK_WEBHOOK_TOKEN_REHEARSAL_ROLEPLAY || '',
  },
  'Rockstar Learning Platform': {
    botToken: process.env.SLACK_BOT_TOKEN_ROCKSTAR || '',
    channelName: 'rockstar-learning-platform-feedback',
    channelId: 'C0A3YSMAR9V', // Add channel ID here
    webhookToken: process.env.SLACK_WEBHOOK_TOKEN_ROCKSTAR || '',
  },
  'CourseMill': {
    botToken: process.env.SLACK_BOT_TOKEN_COURSEMILL || '',
    channelName: 'coursemill-feedback',
    channelId: 'C0A4Y96BBA5', // Add channel ID here
    webhookToken: process.env.SLACK_WEBHOOK_TOKEN_COURSEMILL || '',
  },
  'CenarioVR Studio & Studio Platform Services - AI Toolkit': {
    botToken: process.env.SLACK_BOT_TOKEN_CENARIOVR || '',
    channelName: 'cenariovr-feedback',
    channelId: 'C0A4FVCSX3P', // Add channel ID here
    webhookToken: process.env.SLACK_WEBHOOK_TOKEN_CENARIOVR || '',
  },
  'Review Link': {
    botToken: process.env.SLACK_BOT_TOKEN_REVIEW_LINK || '',
    channelName: 'review-link-feedback',
    channelId: 'C0A443B24MD', // Add channel ID here
    webhookToken: process.env.SLACK_WEBHOOK_TOKEN_REVIEW_LINK || '',
  },
  'Asset Library Interface / Keeper': {
    botToken: process.env.SLACK_BOT_TOKEN_ASSET_LIBRARY || '',
    channelName: 'asset-library-feedback',
    channelId: 'C0A4KJBCZ7C', // Add channel ID here
    webhookToken: process.env.SLACK_WEBHOOK_TOKEN_ASSET_LIBRARY || '',
  },
  'Spice - New Development': {
    botToken: process.env.SLACK_BOT_TOKEN_SPICE || '',
    channelName: 'spice-feedback',
    channelId: 'C0A500UH2HF', // Add channel ID here
    webhookToken: process.env.SLACK_WEBHOOK_TOKEN_SPICE || '',
  },
};

// Webhook tokens for sending notifications (kept for backwards compatibility)
const WEBHOOK_TOKENS = {
  'admin': process.env.SLACK_WEBHOOK_TOKEN_ADMIN || '',
  'microbuilder': process.env.SLACK_WEBHOOK_TOKEN_MICROBUILDER || '',
  'lectora-online': process.env.SLACK_WEBHOOK_TOKEN_LECTORA_ONLINE || '',
  'lectora-desktop': process.env.SLACK_WEBHOOK_TOKEN_LECTORA_DESKTOP || '',
  'training-arcade': process.env.SLACK_WEBHOOK_TOKEN_TRAINING_ARCADE || '',
  'the-training-arcade-feedback': process.env.SLACK_WEBHOOK_TOKEN_TRAINING_ARCADE || '',
  'rehearsal-roleplay': process.env.SLACK_WEBHOOK_TOKEN_REHEARSAL_ROLEPLAY || '',
  'rockstar': process.env.SLACK_WEBHOOK_TOKEN_ROCKSTAR || '',
  'rockstar-learning-platform-feedback': process.env.SLACK_WEBHOOK_TOKEN_ROCKSTAR || '',
  'coursemill': process.env.SLACK_WEBHOOK_TOKEN_COURSEMILL || '',
  'cenariovr': process.env.SLACK_WEBHOOK_TOKEN_CENARIOVR || '',
  'review-link': process.env.SLACK_WEBHOOK_TOKEN_REVIEW_LINK || '',
  'asset-library': process.env.SLACK_WEBHOOK_TOKEN_ASSET_LIBRARY || '',
  'spice': process.env.SLACK_WEBHOOK_TOKEN_SPICE || '',
};

// Cache for channel IDs (to avoid repeated lookups)
const channelIdCache = {};

// ============================================
// SLACK API HELPERS
// ============================================

// Make a Slack API call with specific bot token (form-urlencoded for most endpoints)
function callSlackAPI(botToken, endpoint, data) {
  return new Promise((resolve, reject) => {
    // Convert data to URL-encoded format
    const formData = new URLSearchParams(data).toString();
    
    const options = {
      hostname: 'slack.com',
      port: 443,
      path: `/api/${endpoint}`,
      method: 'POST',
      agent: httpsAgent,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${botToken}`,
        'Content-Length': Buffer.byteLength(formData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          resolve({ ok: false, error: 'Invalid JSON response' });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(formData);
    req.end();
  });
}

// Find channel by name
async function findChannelByName(botToken, channelName) {
  // Check cache first
  if (channelIdCache[channelName]) {
    console.log(`📋 Using cached channel ID for ${channelName}: ${channelIdCache[channelName]}`);
    return channelIdCache[channelName];
  }

  console.log(`🔍 Looking up channel: ${channelName}`);
  
  // Try public channels first
  let result = await callSlackAPI(botToken, 'conversations.list', {
    types: 'public_channel,private_channel',
    limit: '1000'
  });
  
  if (result.ok && result.channels) {
    const channel = result.channels.find(ch => 
      ch.name === channelName || 
      ch.name === channelName.replace(/-/g, '_') ||
      ch.name.includes(channelName.split('-')[0])
    );
    
    if (channel) {
      console.log(`✅ Found channel: ${channel.name} (${channel.id})`);
      channelIdCache[channelName] = channel.id;
      return channel.id;
    }
  }
  
  console.log(`⚠️ Channel not found: ${channelName}`);
  console.log(`📝 Available channels: ${result.channels ? result.channels.map(c => c.name).join(', ') : 'none'}`);
  return null;
}

// Look up a Slack user by email
async function lookupUserByEmail(botToken, email) {
  console.log(`🔍 Looking up Slack user: ${email}`);
  const result = await callSlackAPI(botToken, 'users.lookupByEmail', { email: email });
  if (result.ok) {
    console.log(`✅ Found user: ${result.user.id} (${result.user.name})`);
    return result.user;
  } else {
    console.log(`⚠️ User not found: ${result.error}`);
    return null;
  }
}

// Invite user to a channel
async function inviteUserToChannel(botToken, userId, channelId) {
  console.log(`➕ Inviting user ${userId} to channel ${channelId}`);
  const result = await callSlackAPI(botToken, 'conversations.invite', {
    channel: channelId,
    users: userId,
  });
  if (result.ok) {
    console.log(`✅ User invited to channel successfully`);
  } else if (result.error === 'already_in_channel') {
    console.log(`ℹ️ User is already in the channel`);
    result.ok = true;
  } else {
    console.log(`❌ Failed to invite user: ${result.error}`);
  }
  return result;
}

// Remove user from a channel
async function removeUserFromChannel(botToken, userId, channelId) {
  console.log(`➖ Removing user ${userId} from channel ${channelId}`);
  const result = await callSlackAPI(botToken, 'conversations.kick', {
    channel: channelId,
    user: userId,
  });
  if (result.ok) {
    console.log(`✅ User removed from channel successfully`);
  } else if (result.error === 'not_in_channel') {
    console.log(`ℹ️ User is not in the channel`);
    result.ok = true;
  } else {
    console.log(`❌ Failed to remove user: ${result.error}`);
  }
  return result;
}

// Get product config with fallback matching
function getProductConfig(product) {
  // Direct match
  if (PRODUCT_CONFIG[product]) {
    return PRODUCT_CONFIG[product];
  }
  
  // Case-insensitive match
  const productLower = product.toLowerCase();
  for (const [key, config] of Object.entries(PRODUCT_CONFIG)) {
    if (key.toLowerCase() === productLower) {
      return config;
    }
  }
  
  // Partial match
  for (const [key, config] of Object.entries(PRODUCT_CONFIG)) {
    if (key.toLowerCase().includes(productLower) || productLower.includes(key.toLowerCase())) {
      return config;
    }
  }
  
  return null;
}

// ============================================
// API HANDLERS
// ============================================

// Handle adding user to Slack channel
async function handleAddToChannel(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', async () => {
    try {
      const { email, product } = JSON.parse(body);
      console.log('\n========================================');
      console.log('➕ ADD USER TO SLACK CHANNEL');
      console.log('========================================');
      console.log(`📧 Email: ${email}`);
      console.log(`📦 Product: ${product}`);

      // Get product config
      const config = getProductConfig(product);
      if (!config) {
        console.log(`⚠️ No configuration for product: ${product}`);
        console.log(`📝 Available products: ${Object.keys(PRODUCT_CONFIG).join(', ')}`);
        res.status(200).json({ success: false, error: 'No channel configured for this product' });
        return;
      }

      console.log(`🔑 Using bot token for: ${product}`);
      console.log(`📺 Target channel: ${config.channelName}`);

      // Look up the user by email
      const user = await lookupUserByEmail(config.botToken, email);
      if (!user) {
        res.status(200).json({ success: false, error: 'User not found in Slack workspace' });
        return;
      }

      // Use direct channel ID if provided, otherwise try to find by name
      let channelId = config.channelId;
      if (!channelId) {
        console.log(`⚠️ No direct channel ID configured, trying to lookup by name...`);
        channelId = await findChannelByName(config.botToken, config.channelName);
      } else {
        console.log(`📋 Using configured channel ID: ${channelId}`);
      }
      
      if (!channelId) {
        console.log(`❌ Channel ID needed! Get it from Slack: Right-click channel → View channel details → Copy Channel ID`);
        res.status(200).json({ 
          success: false, 
          error: `Channel ID not configured for "${config.channelName}". Please add the channel ID in setupProxy.js` 
        });
        return;
      }

      // Invite user to channel
      const result = await inviteUserToChannel(config.botToken, user.id, channelId);
      console.log('========================================\n');
      
      res.status(200).json({
        success: result.ok,
        userId: user.id,
        channelId: channelId,
        channelName: config.channelName,
        error: result.error,
      });
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      res.status(200).json({ success: false, error: error.message });
    }
  });
}

// Handle removing user from Slack channel
async function handleRemoveFromChannel(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', async () => {
    try {
      const { email, product } = JSON.parse(body);
      console.log('\n========================================');
      console.log('➖ REMOVE USER FROM SLACK CHANNEL');
      console.log('========================================');
      console.log(`📧 Email: ${email}`);
      console.log(`📦 Product: ${product}`);

      // Get product config
      const config = getProductConfig(product);
      if (!config) {
        console.log(`⚠️ No configuration for product: ${product}`);
        res.status(200).json({ success: false, error: 'No channel configured for this product' });
        return;
      }

      console.log(`🔑 Using bot token for: ${product}`);
      console.log(`📺 Target channel: ${config.channelName}`);

      // Look up the user by email
      const user = await lookupUserByEmail(config.botToken, email);
      if (!user) {
        res.status(200).json({ success: false, error: 'User not found in Slack workspace' });
        return;
      }

      // Use direct channel ID if provided, otherwise try to find by name
      let channelId = config.channelId;
      if (!channelId) {
        channelId = await findChannelByName(config.botToken, config.channelName);
      }
      
      if (!channelId) {
        res.status(200).json({ 
          success: false, 
          error: `Channel ID not configured for "${config.channelName}".` 
        });
        return;
      }

      // Remove user from channel
      const result = await removeUserFromChannel(config.botToken, user.id, channelId);
      console.log('========================================\n');
      
      res.status(200).json({
        success: result.ok,
        userId: user.id,
        channelId: channelId,
        channelName: config.channelName,
        error: result.error,
      });
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      res.status(200).json({ success: false, error: error.message });
    }
  });
}

// Handle webhook notifications (for sending messages to channels)
function handleWebhook(req, res) {
  const urlParts = req.url.split('/');
  const channel = urlParts[urlParts.length - 1] || 'admin';
  const webhookToken = WEBHOOK_TOKENS[channel] || WEBHOOK_TOKENS['admin'];

  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', () => {
    const options = {
      hostname: 'hooks.slack.com',
      port: 443,
      path: `/services/${webhookToken}`,
      method: 'POST',
      agent: httpsAgent,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    console.log(`📤 Sending webhook to: ${channel}`);

    const slackReq = https.request(options, (slackRes) => {
      let responseData = '';
      slackRes.on('data', (chunk) => responseData += chunk);
      slackRes.on('end', () => {
        console.log(`✅ Webhook response: ${slackRes.statusCode}`);
        res.status(200).json({ success: slackRes.statusCode === 200, channel });
      });
    });

    slackReq.on('error', (error) => {
      console.error(`❌ Webhook error: ${error.message}`);
      res.status(200).json({ success: false, error: error.message });
    });

    slackReq.write(body);
    slackReq.end();
  });
}


// ============================================
// GMAIL / GOOGLE APPS SCRIPT CONFIGURATION
// ============================================

// NOTE: Gmail is now sent via SMTP (see GMAIL_SMTP_CONFIG at the top of this file)
// The Apps Script approach is no longer used


// ============================================
// GMAIL NOTIFICATION HANDLERS (SMTP)
// ============================================

// Send email via Google Apps Script Web App
async function sendViaAppsScript(emailData) {
  return new Promise((resolve, reject) => {
    const url = new URL(GMAIL_APPS_SCRIPT.webAppUrl);
    const postData = JSON.stringify(emailData);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: 'POST',
      agent: httpsAgent,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          // Handle redirects (Apps Script often redirects)
          if (res.statusCode === 302 || res.statusCode === 301) {
            console.log('📧 Apps Script redirect received - email likely sent');
            resolve({ success: true, message: 'Email sent via Apps Script' });
            return;
          }
          
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const result = data ? JSON.parse(data) : { success: true };
            resolve(result);
          } else {
            reject(new Error(`Apps Script error: ${res.statusCode}`));
          }
        } catch (e) {
          // If we can't parse but status is OK, assume success
          if (res.statusCode >= 200 && res.statusCode < 400) {
            resolve({ success: true, message: 'Email sent' });
          } else {
            reject(new Error(`Apps Script error: ${e.message}`));
          }
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Handle sending Gmail notification
async function handleSendGmail(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', async () => {
    try {
      const { to, subject, body: emailBody, htmlBody, recipientName, action, product, accessLevel, adminName } = JSON.parse(body);
      
      console.log('\n========================================');
      console.log('📧 SEND GMAIL NOTIFICATION');
      console.log('========================================');
      console.log(`📬 To: ${to}`);
      console.log(`📋 Subject: ${subject}`);
      console.log(`📦 Product: ${product}`);
      console.log(`🎬 Action: ${action}`);

      // Option 1: Use Google Apps Script (RECOMMENDED)
      if (GMAIL_APPS_SCRIPT.enabled && GMAIL_APPS_SCRIPT.webAppUrl) {
        console.log('📤 Sending email via Google Apps Script...');
        
        try {
          const result = await sendViaAppsScript({
            to,
            subject,
            body: emailBody,
            recipientName,
            action,
            product,
            accessLevel,
            adminName,
          });
          
          console.log(`✅ Email sent via Apps Script!`);
          console.log('========================================\n');
          
          res.status(200).json({ 
            success: true, 
            method: 'apps_script',
            message: `Email sent to ${to}`,
          });
          return;
        } catch (appsScriptError) {
          console.error(`⚠️ Apps Script failed: ${appsScriptError.message}`);
          // Fall through to try SMTP if available
        }
      }

      // Option 2: Use SMTP
      if (GMAIL_SMTP_CONFIG.enabled && GMAIL_SMTP_CONFIG.email && GMAIL_SMTP_CONFIG.appPassword) {
        // Initialize transporter if not already done
        if (!emailTransporter) {
          if (!initEmailTransporter()) {
            throw new Error('Failed to initialize email transporter');
          }
        }

        // Generate HTML email content
        const htmlContent = htmlBody || generateHtmlEmail(recipientName, action, product, accessLevel, adminName);

        // Email options
        const mailOptions = {
          from: `"${GMAIL_SMTP_CONFIG.senderName}" <${GMAIL_SMTP_CONFIG.email}>`,
          to: to,
          subject: subject,
          text: emailBody,
          html: htmlContent,
        };

        console.log('📤 Sending email via SMTP...');

        // Send email
        const info = await emailTransporter.sendMail(mailOptions);
        
        console.log(`✅ Email sent via SMTP!`);
        console.log(`📧 Message ID: ${info.messageId}`);
        console.log('========================================\n');

        res.status(200).json({ 
          success: true, 
          method: 'smtp',
          message: `Email sent to ${to}`,
          messageId: info.messageId
        });
        return;
      }

      // Neither configured - log only
      console.log('⚠️ No Gmail method configured (Apps Script or SMTP)');
      console.log('📝 To enable: Configure GMAIL_APPS_SCRIPT or GMAIL_SMTP_CONFIG in setupProxy.js');
      console.log('========================================\n');
      
      res.status(200).json({ 
        success: true, 
        note: 'Gmail not configured - email logged but not sent',
        logged: { to, subject, action, product }
      });

    } catch (error) {
      console.error(`❌ Email error: ${error.message}`);
      console.log('========================================\n');
      res.status(200).json({ success: false, error: error.message });
    }
  });
}

// Generate HTML email body
function generateHtmlEmail(recipientName, action, product, accessLevel, adminName) {
  let actionColor = '#667eea';
  let actionIcon = '📋';
  let actionTitle = 'Access Update';
  let actionText = '';

  switch (action) {
    case 'access_granted':
      actionColor = '#10b981';
      actionIcon = '✅';
      actionTitle = 'Access Granted';
      actionText = `You have been granted access to the <strong>${product}</strong> stakeholder feedback sheet.`;
      break;
    case 'access_updated':
      actionColor = '#f59e0b';
      actionIcon = '📝';
      actionTitle = 'Access Updated';
      actionText = `Your access has been updated for the <strong>${product}</strong> stakeholder feedback sheet.`;
      break;
    case 'access_revoked':
      actionColor = '#ef4444';
      actionIcon = '🚫';
      actionTitle = 'Access Revoked';
      actionText = `Your access has been revoked from the <strong>${product}</strong> stakeholder feedback sheet.`;
      break;
    default:
      actionText = `Your access to the <strong>${product}</strong> stakeholder feedback sheet has been updated.`;
  }

  const date = new Date();
  
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f8fafc;">
  <table cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;margin:0 auto;background-color:#ffffff;">
    <tr>
      <td style="background:linear-gradient(135deg,${actionColor} 0%,${actionColor}dd 100%);padding:30px;text-align:center;">
        <h1 style="color:#ffffff;margin:0;font-size:24px;">${actionIcon} ${actionTitle}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:30px;">
        <p style="margin:0 0 20px 0;font-size:16px;color:#374151;">Dear ${recipientName || 'User'},</p>
        <p style="margin:0 0 20px 0;font-size:16px;color:#374151;">${actionText}</p>
        ${accessLevel && accessLevel !== 'None' && accessLevel !== 'N/A' ? `
        <table cellpadding="0" cellspacing="0" width="100%" style="background-color:#f3f4f6;border-radius:8px;margin:20px 0;">
          <tr>
            <td style="padding:20px;">
              <p style="margin:0;font-size:14px;color:#6b7280;">Access Level</p>
              <p style="margin:5px 0 0 0;font-size:18px;color:${actionColor};font-weight:600;">${accessLevel}</p>
            </td>
            <td style="padding:20px;">
              <p style="margin:0;font-size:14px;color:#6b7280;">Product</p>
              <p style="margin:5px 0 0 0;font-size:18px;color:#374151;font-weight:600;">${product}</p>
            </td>
          </tr>
        </table>
        ` : ''}
        <p style="margin:20px 0 0 0;font-size:14px;color:#6b7280;">
          This action was performed by <strong>${adminName || 'Administrator'}</strong> on ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color:#f3f4f6;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="margin:0;font-size:12px;color:#9ca3af;">This is an automated message from User Access Manager</p>
        <p style="margin:5px 0 0 0;font-size:12px;color:#9ca3af;">© ${date.getFullYear()} ELB Learning. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

// ============================================
// REGISTER ROUTES
// ============================================

module.exports = function(app) {
  // Slack channel membership management
  app.post('/api/slack/channel/add', handleAddToChannel);
  app.post('/api/slack/channel/remove', handleRemoveFromChannel);
  
  // Webhook notifications
  app.post('/api/slack-webhook', handleWebhook);
  app.post('/api/slack-webhook/:channel', handleWebhook);
  
  
  // Gmail notification (via Apps Script)
  app.post('/api/gmail/send', handleSendGmail);
  
  console.log('✅ Slack proxy routes registered');
  console.log('✅ Gmail notification routes registered');
  console.log('📦 Configured products:', Object.keys(PRODUCT_CONFIG).join(', '));
  
  // Check SMTP configuration
  if (GMAIL_SMTP_CONFIG.enabled && GMAIL_SMTP_CONFIG.email && GMAIL_SMTP_CONFIG.appPassword) {
    initEmailTransporter();
    console.log(`✅ Gmail SMTP configured (sending from: ${GMAIL_SMTP_CONFIG.email})`);
  } else {
    console.log('⚠️ Gmail SMTP NOT configured - Emails will be logged only');
    console.log('   Add email and appPassword in GMAIL_SMTP_CONFIG to enable');
  }
};
