/**
 * Gmail Notification Service
 * Integrates with Google Apps Script to send email notifications
 * 
 * This service calls a deployed Google Apps Script web app
 * to send emails when users' access changes.
 */

import { getGmailScriptUrl, hasGmailScriptConfigured } from '../config/gmailConfig';

export interface GmailNotificationPayload {
  recipientEmail: string;
  recipientName: string;
  action: 'access_granted' | 'access_updated' | 'access_revoked';
  product: string;
  accessLevel: string;
  adminName: string;
  additionalMessage?: string;
}

export interface GmailNotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Get email subject based on action type
 */
const getEmailSubject = (action: string, product: string): string => {
  switch (action) {
    case 'access_granted':
      return `Access Granted: ${product} Feedback Sheet`;
    case 'access_updated':
      return `Access Updated: ${product} Feedback Sheet`;
    case 'access_revoked':
      return `Access Revoked: ${product} Feedback Sheet`;
    default:
      return `Access Update: ${product} Feedback Sheet`;
  }
};

/**
 * Get email body based on action type
 */
const getEmailBody = (payload: GmailNotificationPayload): string => {
  const { recipientName, action, product, accessLevel, adminName, additionalMessage } = payload;
  
  let actionText = '';
  let accessDetails = '';

  switch (action) {
    case 'access_granted':
      actionText = 'You have been granted access to';
      accessDetails = accessLevel !== 'None' && accessLevel !== 'N/A' 
        ? `Your access level: ${accessLevel}`
        : '';
      break;
    case 'access_updated':
      actionText = 'Your access has been updated for';
      accessDetails = accessLevel !== 'None' && accessLevel !== 'N/A'
        ? `Your new access level: ${accessLevel}`
        : '';
      break;
    case 'access_revoked':
      actionText = 'Your access has been revoked from';
      accessDetails = 'You no longer have access to this resource.';
      break;
  }

  const body = `
Dear ${recipientName},

${actionText} the ${product} stakeholder feedback sheet.

${accessDetails}

${additionalMessage ? `\n${additionalMessage}\n` : ''}
This action was performed by ${adminName} on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}.

If you have any questions about this change, please contact your administrator.

Best regards,
User Access Manager
ELB Learning
  `.trim();

  return body;
};

/**
 * Send Gmail notification via Google Apps Script
 */
export const sendGmailNotification = async (
  payload: GmailNotificationPayload
): Promise<GmailNotificationResult> => {
  try {
    // Check if Gmail script is configured
    if (!hasGmailScriptConfigured()) {
      console.log('⚠️ Gmail Apps Script not configured - using backend proxy');
      
      // Use the backend proxy endpoint instead
      const response = await fetch('/api/gmail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: payload.recipientEmail,
          subject: getEmailSubject(payload.action, payload.product),
          body: getEmailBody(payload),
          recipientName: payload.recipientName,
          action: payload.action,
          product: payload.product,
          accessLevel: payload.accessLevel,
          adminName: payload.adminName,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Gmail notification sent to ${payload.recipientEmail}`);
        return { success: true, messageId: result.messageId };
      } else {
        console.warn(`⚠️ Failed to send Gmail notification: ${result.error}`);
        return { success: false, error: result.error };
      }
    }

    // Direct call to Google Apps Script
    const scriptUrl = getGmailScriptUrl();
    console.log(`📧 Sending Gmail notification to ${payload.recipientEmail}...`);

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: payload.recipientEmail,
        subject: getEmailSubject(payload.action, payload.product),
        body: getEmailBody(payload),
        htmlBody: getHtmlEmailBody(payload),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gmail script error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (result.success) {
      console.log(`✅ Gmail notification sent successfully to ${payload.recipientEmail}`);
      return { success: true, messageId: result.messageId };
    } else {
      console.warn(`⚠️ Gmail notification failed: ${result.error}`);
      return { success: false, error: result.error };
    }
  } catch (error: any) {
    console.error(`❌ Gmail notification error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Generate HTML email body for better formatting
 */
const getHtmlEmailBody = (payload: GmailNotificationPayload): string => {
  const { recipientName, action, product, accessLevel, adminName, additionalMessage } = payload;
  
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
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
  <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, ${actionColor} 0%, ${actionColor}dd 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${actionIcon} ${actionTitle}</h1>
      </td>
    </tr>
    
    <!-- Content -->
    <tr>
      <td style="padding: 30px;">
        <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151;">Dear ${recipientName},</p>
        
        <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151;">${actionText}</p>
        
        ${accessLevel !== 'None' && accessLevel !== 'N/A' ? `
        <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f3f4f6; border-radius: 8px; margin: 20px 0;">
          <tr>
            <td style="padding: 20px;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Access Level</p>
              <p style="margin: 5px 0 0 0; font-size: 18px; color: ${actionColor}; font-weight: 600;">${accessLevel}</p>
            </td>
            <td style="padding: 20px;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Product</p>
              <p style="margin: 5px 0 0 0; font-size: 18px; color: #374151; font-weight: 600;">${product}</p>
            </td>
          </tr>
        </table>
        ` : ''}
        
        ${additionalMessage ? `<p style="margin: 0 0 20px 0; font-size: 16px; color: #374151;">${additionalMessage}</p>` : ''}
        
        <p style="margin: 20px 0 0 0; font-size: 14px; color: #6b7280;">
          This action was performed by <strong>${adminName}</strong> on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}.
        </p>
        
        <p style="margin: 20px 0 0 0; font-size: 14px; color: #6b7280;">
          If you have any questions about this change, please contact your administrator.
        </p>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; font-size: 12px; color: #9ca3af;">
          This is an automated message from User Access Manager
        </p>
        <p style="margin: 5px 0 0 0; font-size: 12px; color: #9ca3af;">
          © ${new Date().getFullYear()} ELB Learning. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * Send notification for sheet access change
 */
export const sendSheetAccessNotification = async (
  recipientEmail: string,
  recipientName: string,
  product: string,
  oldAccessLevel: string,
  newAccessLevel: string,
  adminName: string
): Promise<GmailNotificationResult> => {
  let action: GmailNotificationPayload['action'];
  
  if (oldAccessLevel === 'None' && newAccessLevel !== 'None') {
    action = 'access_granted';
  } else if (newAccessLevel === 'None' || newAccessLevel === 'N/A') {
    action = 'access_revoked';
  } else {
    action = 'access_updated';
  }

  return sendGmailNotification({
    recipientEmail,
    recipientName,
    action,
    product,
    accessLevel: newAccessLevel,
    adminName,
  });
};

export default {
  sendGmailNotification,
  sendSheetAccessNotification,
};

