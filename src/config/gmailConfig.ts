/**
 * Gmail / Google Apps Script Configuration
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Create a new Google Apps Script project:
 *    - Go to https://script.google.com
 *    - Create a new project
 *    - Copy the provided Apps Script code (see GoogleAppsScript.gs template below)
 * 
 * 2. Deploy as Web App:
 *    - Click "Deploy" → "New deployment"
 *    - Select type: "Web app"
 *    - Execute as: "Me" (your account)
 *    - Who has access: "Anyone" (or "Anyone with Google Account" for more security)
 *    - Click "Deploy" and copy the Web App URL
 * 
 * 3. Add the Web App URL below in GMAIL_SCRIPT_CONFIG
 * 
 * 4. (Optional) Configure email templates in the Apps Script
 */

export interface GmailScriptConfig {
  scriptUrl: string;         // The deployed Web App URL
  isEnabled: boolean;        // Toggle to enable/disable Gmail notifications
  senderName: string;        // Display name for the sender
  replyTo?: string;          // Reply-to email address
}

// Gmail Apps Script Configuration
// Add your deployed Google Apps Script Web App URL here
export const GMAIL_SCRIPT_CONFIG: GmailScriptConfig = {
  scriptUrl: '', // e.g., 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
  isEnabled: true,
  senderName: 'User Access Manager',
  replyTo: '', // Optional: add reply-to email
};

/**
 * Product-specific email templates (optional)
 * You can customize email templates per product
 */
export const PRODUCT_EMAIL_TEMPLATES: Record<string, {
  accessGrantedSubject?: string;
  accessRevokedSubject?: string;
  additionalInfo?: string;
}> = {
  'MicroBuilder': {
    additionalInfo: 'You can access the MicroBuilder feedback sheet to view and contribute to product feedback.',
  },
  'Lectora Online': {
    additionalInfo: 'You can access the Lectora Online feedback sheet to view and contribute to product feedback.',
  },
  'Lectora Desktop': {
    additionalInfo: 'You can access the Lectora Desktop feedback sheet to view and contribute to product feedback.',
  },
  'The Training Arcade': {
    additionalInfo: 'You can access The Training Arcade feedback sheet to view and contribute to product feedback.',
  },
  'Rehearsal & RolePlay': {
    additionalInfo: 'You can access the Rehearsal & RolePlay feedback sheet to view and contribute to product feedback.',
  },
  'Rockstar Learning Platform': {
    additionalInfo: 'You can access the Rockstar Learning Platform feedback sheet to view and contribute to product feedback.',
  },
  'CourseMill': {
    additionalInfo: 'You can access the CourseMill feedback sheet to view and contribute to product feedback.',
  },
  'CenarioVR Studio & Studio Platform Services - AI Toolkit': {
    additionalInfo: 'You can access the CenarioVR feedback sheet to view and contribute to product feedback.',
  },
  'Review Link': {
    additionalInfo: 'You can access the Review Link feedback sheet to view and contribute to product feedback.',
  },
  'Asset Library Interface / Keeper': {
    additionalInfo: 'You can access the Asset Library feedback sheet to view and contribute to product feedback.',
  },
  'Spice - New Development': {
    additionalInfo: 'You can access the Spice feedback sheet to view and contribute to product feedback.',
  },
};

/**
 * Check if Gmail Apps Script is configured
 */
export const hasGmailScriptConfigured = (): boolean => {
  return !!(GMAIL_SCRIPT_CONFIG.scriptUrl && GMAIL_SCRIPT_CONFIG.isEnabled);
};

/**
 * Get the Gmail Apps Script URL
 */
export const getGmailScriptUrl = (): string => {
  return GMAIL_SCRIPT_CONFIG.scriptUrl;
};

/**
 * Get product-specific email template info
 */
export const getProductEmailTemplate = (productName: string) => {
  return PRODUCT_EMAIL_TEMPLATES[productName] || {};
};

export default GMAIL_SCRIPT_CONFIG;

