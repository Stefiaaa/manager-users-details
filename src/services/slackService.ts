import { SlackNotificationPayload, NotificationResult } from '../types';
import { getProductChannel, hasProductChannel } from '../config/slackChannelConfig';
import { getProductWebhook } from '../config/slackWebhooks';

// Slack API Configuration
// IMPORTANT: Webhook notifications work through the setupProxy.js
// Channel membership management uses webhook notifications to announce changes
// (Actual Slack channel membership requires backend integration with Slack Web API)

// Disable webhook notifications - users are added/removed silently
const USE_WEBHOOK_NOTIFICATIONS = false;

const PROXY_BASE_URL = process.env.REACT_APP_PROXY_BASE_URL || '';
const isProxyConfigured = (): boolean => Boolean(PROXY_BASE_URL) || process.env.NODE_ENV !== 'production';
const buildProxyUrl = (path: string): string => (PROXY_BASE_URL ? `${PROXY_BASE_URL}${path}` : path);

const readJsonResponse = async (response: Response): Promise<any> => {
  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();
  if (!contentType.includes('application/json')) {
    const preview = text.slice(0, 200);
    throw new Error(`Unexpected response format (${response.status}): ${preview}`);
  }
  try {
    return JSON.parse(text);
  } catch (error: any) {
    throw new Error(`Invalid JSON response (${response.status}): ${error.message}`);
  }
};

// Note: Direct Slack API calls require a backend server with OAuth tokens
// The current implementation uses webhook notifications through setupProxy.js

console.log('🔧 Slack Service initialized - using webhook notifications');

// Result interface for channel membership operations
export interface ChannelMembershipResult {
  success: boolean;
  channelName?: string;
  channelId?: string;
  error?: string;
}

/**
 * Format the Slack message based on the action type
 */
const formatSlackMessage = (payload: SlackNotificationPayload): object => {
  const { action, userName, userEmail, product, accessLevel, performedBy } = payload;
  
  const adminName = performedBy || 'Super Admin';
  const timestamp = new Date().toLocaleString();

  let emoji = '📋';
  let title = 'User Access Update';
  let color = '#667eea';
  let actionText = '';

  switch (action) {
    case 'user_added':
      emoji = '✅';
      title = 'New User Access Granted';
      color = '#10b981';
      actionText = `A new user has been granted access to the ${product} feedback sheet.`;
      break;
    case 'user_updated':
      emoji = '📝';
      title = 'User Access Updated';
      color = '#f59e0b';
      actionText = `User access settings have been updated for ${product}.`;
      break;
    case 'access_revoked':
      emoji = '🚫';
      title = 'User Access Revoked';
      color = '#ef4444';
      actionText = `User access has been revoked from the ${product} feedback sheet.`;
      break;
  }

  // Slack Block Kit message format
  return {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${emoji} ${title}`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: actionText,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*User Name:*\n${userName}`,
          },
          {
            type: 'mrkdwn',
            text: `*Email:*\n${userEmail}`,
          },
          {
            type: 'mrkdwn',
            text: `*Product:*\n${product}`,
          },
          {
            type: 'mrkdwn',
            text: `*Access Level:*\n${accessLevel}`,
          },
        ],
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `👤 *Action by:* ${adminName} | 🕐 *Time:* ${timestamp}`,
          },
        ],
      },
    ],
    attachments: [
      {
        color: color,
        fallback: `${title}: ${userName} (${userEmail}) - ${product}`,
      },
    ],
  };
};

/**
 * Send notification to Slack channel
 * In production, this would make an actual POST request to Slack webhook
 */
export const sendSlackNotification = async (
  payload: SlackNotificationPayload
): Promise<{ success: boolean; error?: string }> => {
  try {
    const message = formatSlackMessage(payload);

    // Get webhook for the product (uses proxy URL)
    const webhookConfig = getProductWebhook(payload.product);
    
    if (webhookConfig && USE_WEBHOOK_NOTIFICATIONS) {
      console.log(`📤 Sending Slack notification to ${webhookConfig.channelName}...`);
      
      const response = await fetch(webhookConfig.slackWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
        redirect: 'manual', // Don't follow redirects
      });

      // Check for redirect (indicates invalid webhook)
      if (response.status === 302 || response.status === 301) {
        console.warn(`⚠️ Webhook returned redirect - may be invalid`);
        return { success: false, error: 'Webhook redirect - may be invalid' };
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Slack webhook error: ${response.status} - ${errorText}`);
      }

      console.log('✅ Slack notification sent successfully to:', webhookConfig.channelName);
      return { success: true };
    }

    // Fallback if no webhook configured for this product
    console.log(`⚠️ No webhook configured for product: ${payload.product}, logging notification`);
    console.log('📋 Message payload:', JSON.stringify(message, null, 2));
    return { success: true };
  } catch (error: any) {
    console.error('❌ Slack notification failed:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send email notification via Google Apps Script
 * Calls the backend proxy which forwards to the deployed Apps Script
 */
export const sendGmailNotification = async (
  userEmail: string,
  userName: string,
  action: string,
  product: string,
  accessLevel?: string,
  adminName?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('📧 Sending Gmail notification to:', userEmail);

    // Map action to Gmail notification action type
    let gmailAction: 'access_granted' | 'access_updated' | 'access_revoked';
    switch (action) {
      case 'user_added':
        gmailAction = 'access_granted';
        break;
      case 'access_revoked':
        gmailAction = 'access_revoked';
        break;
      default:
        gmailAction = 'access_updated';
    }

    // Generate email subject
    const subject = `Feedback Access ${action === 'user_added' ? 'Granted' : action === 'access_revoked' ? 'Revoked' : 'Updated'}: ${product}`;
    
    // Generate email body
    const body = `Dear ${userName},

Your access to the ${product} stakeholder feedback sheet has been ${action === 'user_added' ? 'granted' : action === 'access_revoked' ? 'revoked' : 'updated'}.

${accessLevel && accessLevel !== 'None' && accessLevel !== 'N/A' ? `Access Level: ${accessLevel}` : ''}

This action was performed by ${adminName || 'Administrator'} on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}.

If you have any questions, please contact your administrator.

Best regards,
User Access Manager
ELB Learning`;

    // Call the backend proxy to send email
    if (!isProxyConfigured()) {
      const errorMessage = 'Gmail proxy not configured for production';
      console.warn(`⚠️ ${errorMessage}`);
      return { success: false, error: errorMessage };
    }

    const response = await fetch(buildProxyUrl('/api/gmail/send'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: userEmail,
        subject,
        body,
        recipientName: userName,
        action: gmailAction,
        product,
        accessLevel: accessLevel || 'N/A',
        adminName: adminName || 'Administrator',
      }),
    });

    const result = await readJsonResponse(response);

    if (result.success) {
      console.log('✅ Gmail notification sent successfully to:', userEmail);
      return { success: true };
    } else {
      console.warn('⚠️ Gmail notification issue:', result.error || result.note);
      // If it's just a config note but logged, still return success
      if (result.note) {
        return { success: true };
      }
      return { success: false, error: result.error };
    }
  } catch (error: any) {
    console.error('❌ Gmail notification failed:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send all notifications (Slack + Gmail based on user preferences)
 */
export const sendNotifications = async (
  slackPayload: SlackNotificationPayload,
  sendSlack: boolean,
  sendEmail: boolean,
  userEmail: string,
  userName: string
): Promise<NotificationResult> => {
  const results: NotificationResult = {
    slackSuccess: !sendSlack, // If Slack is not needed, mark as success (will show as "Not Sent")
    gmailSuccess: !sendEmail, // If email is not needed, mark as success (will show as "Not Sent")
  };

  // Send Slack notification if enabled
  if (sendSlack) {
    const slackResult = await sendSlackNotification(slackPayload);
    results.slackSuccess = slackResult.success;
    if (!slackResult.success) {
      results.slackError = slackResult.error;
    }
  }

  // Send Gmail notification if enabled
  if (sendEmail) {
    const gmailResult = await sendGmailNotification(
      userEmail,
      userName,
      slackPayload.action,
      slackPayload.product,
      slackPayload.accessLevel, // Pass access level for email content
      slackPayload.performedBy   // Pass admin name for email content
    );
    results.gmailSuccess = gmailResult.success;
    if (!gmailResult.success) {
      results.gmailError = gmailResult.error;
    }
  }

  return results;
};

/**
 * Add a user to a Slack channel based on product
 * Uses Slack API to invite user to the product's channel
 */
export const addUserToProductChannel = async (
  userEmail: string,
  userName: string,
  product: string
): Promise<ChannelMembershipResult> => {
  try {
    // Check if product has a channel mapping
    if (!hasProductChannel(product)) {
      console.log(`⚠️ No Slack channel mapping for product: ${product}`);
      return { success: false, error: `No Slack channel configured for ${product}` };
    }

    const channelMapping = getProductChannel(product);
    if (!channelMapping) {
      return { success: false, error: 'Channel mapping not found' };
    }

    console.log('========================================');
    console.log('➕ ADDING USER TO SLACK CHANNEL');
    console.log('========================================');
    console.log(`👤 User: ${userName} (${userEmail})`);
    console.log(`📦 Product: ${product}`);
    console.log(`💬 Channel: ${channelMapping.channelName}`);

    // Call the server-side API to add user to Slack channel
    if (!isProxyConfigured()) {
      const errorMessage = 'Slack proxy not configured for production';
      console.warn(`⚠️ ${errorMessage}`);
      return { success: false, error: errorMessage };
    }

    const response = await fetch(buildProxyUrl('/api/slack/channel/add'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, product }),
    });

    const result = await readJsonResponse(response);
    
    if (result.success) {
      console.log(`✅ User added to Slack channel ${channelMapping.channelName}`);
      // Notification disabled - user is added silently as a member
    } else {
      console.warn(`⚠️ Failed to add user to channel: ${result.error}`);
    }

    console.log('========================================\n');

    return {
      success: result.success,
      channelName: channelMapping.channelName,
      channelId: channelMapping.channelId,
      error: result.error,
    };
  } catch (error: any) {
    console.error(`❌ Failed to add user to channel: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Remove a user from a Slack channel based on product
 * Uses Slack API to remove user from the product's channel
 */
export const removeUserFromProductChannel = async (
  userEmail: string,
  userName: string,
  product: string
): Promise<ChannelMembershipResult> => {
  try {
    // Check if product has a channel mapping
    if (!hasProductChannel(product)) {
      console.log(`⚠️ No Slack channel mapping for product: ${product}`);
      return { success: false, error: `No Slack channel configured for ${product}` };
    }

    const channelMapping = getProductChannel(product);
    if (!channelMapping) {
      return { success: false, error: 'Channel mapping not found' };
    }

    console.log('========================================');
    console.log('➖ REMOVING USER FROM SLACK CHANNEL');
    console.log('========================================');
    console.log(`👤 User: ${userName} (${userEmail})`);
    console.log(`📦 Product: ${product}`);
    console.log(`💬 Channel: ${channelMapping.channelName}`);

    // Call the server-side API to remove user from Slack channel
    if (!isProxyConfigured()) {
      const errorMessage = 'Slack proxy not configured for production';
      console.warn(`⚠️ ${errorMessage}`);
      return { success: false, error: errorMessage };
    }

    const response = await fetch(buildProxyUrl('/api/slack/channel/remove'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, product }),
    });

    const result = await readJsonResponse(response);
    
    if (result.success) {
      console.log(`✅ User removed from Slack channel ${channelMapping.channelName}`);
      // Notification disabled - user is removed silently
    } else {
      console.warn(`⚠️ Failed to remove user from channel: ${result.error}`);
    }

    console.log('========================================\n');

    return {
      success: result.success,
      channelName: channelMapping.channelName,
      channelId: channelMapping.channelId,
      error: result.error,
    };
  } catch (error: any) {
    console.error(`❌ Failed to remove user from channel: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Handle product change - remove from old channel and add to new channel
 */
export const handleProductChannelChange = async (
  userEmail: string,
  userName: string,
  oldProduct: string,
  newProduct: string,
  slackNotificationEnabled: boolean
): Promise<{ addResult?: ChannelMembershipResult; removeResult?: ChannelMembershipResult }> => {
  const results: { addResult?: ChannelMembershipResult; removeResult?: ChannelMembershipResult } = {};

  // Only proceed if Slack notifications are enabled
  if (!slackNotificationEnabled) {
    console.log('⚠️ Slack notifications disabled, skipping channel membership changes');
    return results;
  }

  // If products are the same, no change needed
  if (oldProduct === newProduct) {
    console.log('ℹ️ Product unchanged, no channel membership changes needed');
    return results;
  }

  console.log('========================================');
  console.log('🔄 PRODUCT CHANGE - UPDATING CHANNEL MEMBERSHIP');
  console.log('========================================');
  console.log(`👤 User: ${userName} (${userEmail})`);
  console.log(`📦 Old Product: ${oldProduct}`);
  console.log(`📦 New Product: ${newProduct}`);
  console.log('========================================\n');

  // Remove from old product channel
  if (oldProduct && hasProductChannel(oldProduct)) {
    results.removeResult = await removeUserFromProductChannel(userEmail, userName, oldProduct);
  }

  // Add to new product channel
  if (newProduct && hasProductChannel(newProduct)) {
    results.addResult = await addUserToProductChannel(userEmail, userName, newProduct);
  }

  return results;
};

const slackService = {
  sendSlackNotification,
  sendGmailNotification,
  sendNotifications,
  addUserToProductChannel,
  removeUserFromProductChannel,
  handleProductChannelChange,
};

export default slackService;

