/**
 * Google Apps Script for User Access Manager Email Notifications
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Go to https://script.google.com
 * 2. Create a new project
 * 3. Copy and paste this entire code
 * 4. Click "Deploy" → "New deployment"
 * 5. Select type: "Web app"
 * 6. Settings:
 *    - Execute as: "Me" (your account that will send emails)
 *    - Who has access: "Anyone" (to allow API calls from your app)
 * 7. Click "Deploy" and authorize the script
 * 8. Copy the Web App URL and paste it in setupProxy.js (GMAIL_APPS_SCRIPT_URL)
 * 
 * PERMISSIONS NEEDED:
 * - Gmail: Send email on your behalf
 * 
 * NOTE: Emails will be sent from the account that deploys this script
 */

/**
 * Handle POST requests from User Access Manager
 */
function doPost(e) {
  try {
    // Parse the incoming JSON payload
    const data = JSON.parse(e.postData.contents);
    
    // Log the request for debugging
    console.log('Received email request:', JSON.stringify(data));
    
    // Validate required fields
    if (!data.to) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Missing recipient email' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Send the email
    const result = sendEmail(data);
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing request:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: 'ok', 
      message: 'User Access Manager Email Service is running',
      version: '1.0.0'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Send email using Gmail
 * @param {Object} data - Email data
 * @param {string} data.to - Recipient email
 * @param {string} data.subject - Email subject
 * @param {string} data.body - Plain text body
 * @param {string} [data.htmlBody] - HTML body (optional)
 * @returns {Object} Result object with success status
 */
function sendEmail(data) {
  try {
    const { to, subject, body, htmlBody } = data;
    
    // Build email options
    const options = {
      to: to,
      subject: subject || 'User Access Manager Notification',
      body: body || 'You have received a notification from User Access Manager.',
      name: 'User Access Manager', // Sender display name
    };
    
    // Add HTML body if provided
    if (htmlBody) {
      options.htmlBody = htmlBody;
    }
    
    // Send the email
    GmailApp.sendEmail(options.to, options.subject, options.body, {
      name: options.name,
      htmlBody: options.htmlBody,
    });
    
    console.log('Email sent successfully to:', to);
    
    return {
      success: true,
      message: 'Email sent successfully',
      recipient: to,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Test function - Send a test email
 * Run this function to verify the script works
 */
function testSendEmail() {
  const testData = {
    to: 'your-email@example.com', // Replace with your email
    subject: 'Test Email from User Access Manager',
    body: 'This is a test email to verify the Google Apps Script is working correctly.',
    htmlBody: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #667eea;">Test Email</h2>
        <p>This is a test email to verify the Google Apps Script is working correctly.</p>
        <p>If you received this email, the integration is successful!</p>
        <hr style="border-color: #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px;">User Access Manager - ELB Learning</p>
      </div>
    `
  };
  
  const result = sendEmail(testData);
  console.log('Test result:', result);
  return result;
}

/**
 * Send access granted notification
 * @param {string} recipientEmail - User's email
 * @param {string} recipientName - User's name
 * @param {string} product - Product name
 * @param {string} accessLevel - Access level (View/Edit)
 * @param {string} adminName - Admin who granted access
 */
function sendAccessGrantedEmail(recipientEmail, recipientName, product, accessLevel, adminName) {
  const htmlBody = generateAccessEmailHtml('granted', recipientName, product, accessLevel, adminName);
  
  return sendEmail({
    to: recipientEmail,
    subject: `Access Granted: ${product} Feedback Sheet`,
    body: `Dear ${recipientName}, you have been granted ${accessLevel} access to the ${product} feedback sheet.`,
    htmlBody: htmlBody
  });
}

/**
 * Send access revoked notification
 */
function sendAccessRevokedEmail(recipientEmail, recipientName, product, adminName) {
  const htmlBody = generateAccessEmailHtml('revoked', recipientName, product, 'None', adminName);
  
  return sendEmail({
    to: recipientEmail,
    subject: `Access Revoked: ${product} Feedback Sheet`,
    body: `Dear ${recipientName}, your access to the ${product} feedback sheet has been revoked.`,
    htmlBody: htmlBody
  });
}

/**
 * Generate HTML email for access notifications
 */
function generateAccessEmailHtml(action, recipientName, product, accessLevel, adminName) {
  const isGranted = action === 'granted';
  const isRevoked = action === 'revoked';
  
  const color = isGranted ? '#10b981' : isRevoked ? '#ef4444' : '#f59e0b';
  const icon = isGranted ? '✅' : isRevoked ? '🚫' : '📝';
  const title = isGranted ? 'Access Granted' : isRevoked ? 'Access Revoked' : 'Access Updated';
  const actionText = isGranted 
    ? `You have been granted access to the <strong>${product}</strong> stakeholder feedback sheet.`
    : isRevoked 
      ? `Your access to the <strong>${product}</strong> stakeholder feedback sheet has been revoked.`
      : `Your access to the <strong>${product}</strong> stakeholder feedback sheet has been updated.`;

  const date = new Date();
  
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f8fafc;">
  <table cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;margin:0 auto;background-color:#ffffff;">
    <tr>
      <td style="background:linear-gradient(135deg,${color} 0%,${color}dd 100%);padding:30px;text-align:center;">
        <h1 style="color:#ffffff;margin:0;font-size:24px;">${icon} ${title}</h1>
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
              <p style="margin:5px 0 0 0;font-size:18px;color:${color};font-weight:600;">${accessLevel}</p>
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
        <p style="margin:20px 0 0 0;font-size:14px;color:#6b7280;">
          If you have any questions, please contact your administrator.
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
</html>`;
}

