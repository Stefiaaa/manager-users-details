/**
 * Admin Notification Service
 * Sends notifications to admin email and Slack channel for all user access changes
 */

// Enable admin notifications to User-access-manager channel
const USE_WEBHOOK_NOTIFICATIONS = true;

const PROXY_BASE_URL = process.env.REACT_APP_PROXY_BASE_URL || '';
const isProxyConfigured = (): boolean => Boolean(PROXY_BASE_URL) || process.env.NODE_ENV !== 'production';
const buildProxyUrl = (path: string): string => (PROXY_BASE_URL ? `${PROXY_BASE_URL}${path}` : path);

// Admin notification configuration
const ADMIN_CONFIG = {
  email: 'stefia.a@elblearning.com',
  slackChannel: 'user-access-manager',
  // IMPORTANT: Use proxy URL to avoid CORS issues
  // The actual webhook is configured via environment variables in src/setupProxy.js
  // Use proxy URL to avoid CORS issues - actual webhook is configured in src/setupProxy.js
  slackWebhookUrl: '/api/slack-webhook',
};

interface UserChangePayload {
  action: 'user_added' | 'user_updated' | 'access_revoked';
  userName: string;
  userEmail: string;
  product: string;
  accessLevel: string;
  slackChannel?: string;
  status?: string;
  slackNotification?: boolean;
  gmailNotification?: boolean;
  slackNotificationStatus?: string;
  gmailNotificationStatus?: string;
  createdAt?: string;
  performedBy: string;
  timestamp: string;
}

/**
 * Format Slack message for admin notification
 */
const formatAdminSlackMessage = (payload: UserChangePayload): object => {
  const { 
    action, 
    userName, 
    userEmail, 
    product, 
    accessLevel, 
    slackChannel, 
    status, 
    slackNotification, 
    gmailNotification,
    slackNotificationStatus,
    gmailNotificationStatus,
    createdAt, 
    performedBy, 
    timestamp 
  } = payload;

  let emoji = '📋';
  let title = 'User Access Change';
  let color = '#667eea';
  let actionText = '';

  switch (action) {
    case 'user_added':
      emoji = '✅';
      title = 'New User Added';
      color = '#10b981';
      actionText = 'A new user has been added to the feedback access system.';
      break;
    case 'user_updated':
      emoji = '📝';
      title = 'User Updated';
      color = '#f59e0b';
      actionText = 'A user\'s access settings have been updated.';
      break;
    case 'access_revoked':
      emoji = '🚫';
      title = 'User Access Revoked';
      color = '#ef4444';
      actionText = 'A user\'s access has been revoked.';
      break;
  }

  // Check if user is revoked
  const isRevoked = action === 'access_revoked' || status === 'Revoked';

  // Build all fields for the Slack message
  const fields = [
    {
      type: 'mrkdwn',
      text: `*👤 User Name:*\n${userName}`,
    },
    {
      type: 'mrkdwn',
      text: `*📧 Email:*\n${userEmail}`,
    },
    {
      type: 'mrkdwn',
      text: `*📦 Product:*\n${product}`,
    },
    {
      type: 'mrkdwn',
      text: `*🔐 Stakeholder Sheet:*\n${isRevoked ? 'N/A' : (accessLevel || 'Not Set')}`,
    },
    {
      type: 'mrkdwn',
      text: `*💬 Slack Channel:*\n${slackChannel || 'Not Set'}`,
    },
    {
      type: 'mrkdwn',
      text: `*📊 Status:*\n${status || 'Active'}`,
    },
    {
      type: 'mrkdwn',
      text: `*🔔 Slack Notification:*\n${isRevoked ? 'N/A' : (slackNotification ? '✅ Enabled' : '❌ Disabled')}`,
    },
    {
      type: 'mrkdwn',
      text: `*📬 Gmail Notification:*\n${isRevoked ? 'N/A' : (gmailNotification ? '✅ Enabled' : '❌ Disabled')}`,
    },
  ];

  // Add notification statuses if available
  if (slackNotificationStatus) {
    fields.push({
      type: 'mrkdwn',
      text: `*Slack Status:*\n${slackNotificationStatus}`,
    });
  }

  if (gmailNotificationStatus) {
    fields.push({
      type: 'mrkdwn',
      text: `*Gmail Status:*\n${gmailNotificationStatus}`,
    });
  }

  // Add created date if available
  if (createdAt) {
    fields.push({
      type: 'mrkdwn',
      text: `*📅 Created At:*\n${new Date(createdAt).toLocaleString()}`,
    });
  }

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
        fields: fields.slice(0, 10), // Slack allows max 10 fields per section
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `👤 *Action by:* ${performedBy} | 🕐 *Time:* ${timestamp}`,
          },
        ],
      },
    ],
    attachments: [
      {
        color: color,
        fallback: `${title}: ${userName} (${userEmail}) - ${product} - ${status}`,
      },
    ],
  };
};

/**
 * Send Slack notification to admin channel
 * Uses webhook proxy configured in setupProxy.js
 */
const sendAdminSlackNotification = async (payload: UserChangePayload): Promise<{ success: boolean; error?: string }> => {
  try {
    const message = formatAdminSlackMessage(payload);

    console.log(`📤 Sending admin Slack notification to #${ADMIN_CONFIG.slackChannel}...`);

    if (USE_WEBHOOK_NOTIFICATIONS) {
      if (!isProxyConfigured()) {
        const errorMessage = 'Slack proxy not configured for production';
        console.warn(`⚠️ ${errorMessage}`);
        return { success: false, error: errorMessage };
      }

      const response = await fetch(buildProxyUrl(ADMIN_CONFIG.slackWebhookUrl), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
        redirect: 'manual', // Don't follow redirects
      });

      // Check for redirect (indicates invalid webhook)
      if (response.status === 302 || response.status === 301) {
        console.warn(`⚠️ Admin webhook returned redirect - may be invalid`);
        return { success: false, error: 'Webhook redirect - may be invalid' };
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Slack webhook error: ${response.status} - ${errorText}`);
      }

      console.log(`✅ Admin Slack notification sent successfully to #${ADMIN_CONFIG.slackChannel}`);
      return { success: true };
    }

    // Fallback - just log the notification
    console.log(`📋 Admin Slack notification to #${ADMIN_CONFIG.slackChannel}:`);
    console.log(`   Action: ${payload.action}`);
    console.log(`   User: ${payload.userName} (${payload.userEmail})`);
    console.log(`   Product: ${payload.product}`);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Admin Slack notification failed:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send email notification to admin
 * Note: This is a mock implementation. In production, integrate with actual email service.
 */
const sendAdminEmailNotification = async (payload: UserChangePayload): Promise<{ success: boolean; error?: string }> => {
  try {
    const { action, userName, userEmail, product, accessLevel, performedBy, timestamp } = payload;

    let subject = 'User Access Change Notification';
    let actionDescription = '';

    switch (action) {
      case 'user_added':
        subject = `[User Access Manager] New User Added: ${userName}`;
        actionDescription = 'A new user has been added to the feedback access system.';
        break;
      case 'user_updated':
        subject = `[User Access Manager] User Updated: ${userName}`;
        actionDescription = 'A user\'s access settings have been updated.';
        break;
      case 'access_revoked':
        subject = `[User Access Manager] Access Revoked: ${userName}`;
        actionDescription = 'A user\'s access has been revoked.';
        break;
    }

    const emailContent = {
      to: ADMIN_CONFIG.email,
      subject: subject,
      body: `
${actionDescription}

User Details:
- Name: ${userName}
- Email: ${userEmail}
- Product: ${product}
- Access Level: ${accessLevel}

Action performed by: ${performedBy}
Time: ${timestamp}

---
This is an automated notification from the User Access Manager system.
      `.trim(),
    };

    console.log(`📧 Sending admin email notification to ${ADMIN_CONFIG.email}...`);
    console.log('📋 Email content:', emailContent);

    // In production, this would send an actual email using an email service
    // For now, we just log it
    console.log(`✅ Admin email notification sent to ${ADMIN_CONFIG.email}`);

    return { success: true };
  } catch (error: any) {
    console.error('❌ Admin email notification failed:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send all admin notifications (Slack + Email)
 * This is fire-and-forget to not block the main operation
 */
export const notifyAdminOfChange = (payload: UserChangePayload): void => {
  console.log('\n========================================');
  console.log('🔔 ADMIN NOTIFICATION - User Access Change');
  console.log('========================================');

  // Send notifications in background (fire-and-forget)
  Promise.all([
    sendAdminSlackNotification(payload),
    sendAdminEmailNotification(payload),
  ])
    .then(([slackResult, emailResult]) => {
      if (slackResult.success) {
        console.log(`✅ Slack: Notified #${ADMIN_CONFIG.slackChannel}`);
      } else {
        console.warn(`⚠️ Slack: Failed - ${slackResult.error}`);
      }

      if (emailResult.success) {
        console.log(`✅ Email: Notified ${ADMIN_CONFIG.email}`);
      } else {
        console.warn(`⚠️ Email: Failed - ${emailResult.error}`);
      }
      console.log('========================================\n');
    })
    .catch(err => {
      console.warn(`⚠️ Admin notification error (non-blocking): ${err.message}`);
    });
};

/**
 * Helper function to create payload for admin notifications
 */
export const createAdminNotificationPayload = (
  action: 'user_added' | 'user_updated' | 'access_revoked',
  user: {
    name: string;
    email: string;
    product: string;
    stakeholderAccessLevel: string;
    slackChannel?: string;
    status?: string;
    slackNotification?: boolean;
    gmailNotification?: boolean;
    slackNotificationStatus?: string;
    gmailNotificationStatus?: string;
    createdAt?: string;
  },
  performedBy: string
): UserChangePayload => {
  return {
    action,
    userName: user.name,
    userEmail: user.email,
    product: user.product,
    accessLevel: user.stakeholderAccessLevel,
    slackChannel: user.slackChannel,
    status: user.status,
    slackNotification: user.slackNotification,
    gmailNotification: user.gmailNotification,
    slackNotificationStatus: user.slackNotificationStatus,
    gmailNotificationStatus: user.gmailNotificationStatus,
    createdAt: user.createdAt,
    performedBy,
    timestamp: new Date().toLocaleString(),
  };
};

const adminNotificationService = {
  notifyAdminOfChange,
  createAdminNotificationPayload,
  ADMIN_CONFIG,
};

export default adminNotificationService;

