/**
 * Slack Webhook Configuration for Product Channels
 * When a user's Slack notification is enabled/disabled, 
 * a message is sent to the corresponding product channel
 */

export interface ProductWebhookConfig {
  productName: string;
  slackWebhook: string;
  channelName: string;
}

// Product to Slack Webhook mapping
export const PRODUCT_WEBHOOKS: Record<string, ProductWebhookConfig> = {
  'MicroBuilder': {
    productName: 'MicroBuilder',
    slackWebhook: '/api/slack-webhook/microbuilder',
    channelName: '#elb-microbuilder-feedback',
  },
  'Lectora Online': {
    productName: 'Lectora Online',
    slackWebhook: '/api/slack-webhook/lectora-online',
    channelName: '#lectora-online-feedback',
  },
  'Lectora Desktop': {
    productName: 'Lectora Desktop',
    slackWebhook: '/api/slack-webhook/lectora-desktop',
    channelName: '#lectora-desktop-feedback',
  },
  'The Training Arcade': {
    productName: 'The Training Arcade',
    slackWebhook: '/api/slack-webhook/training-arcade',
    channelName: '#the-training-arcade-feedback',
  },
  'Rehearsal & RolePlay': {
    productName: 'Rehearsal & RolePlay',
    slackWebhook: '/api/slack-webhook/rehearsal-roleplay',
    channelName: '#rehearsal-roleplay-feedback',
  },
  'Rockstar Learning Platform': {
    productName: 'Rockstar Learning Platform',
    slackWebhook: '/api/slack-webhook/rockstar',
    channelName: '#rockstar-learning-platform-feedback',
  },
  'CourseMill': {
    productName: 'CourseMill',
    slackWebhook: '/api/slack-webhook/coursemill',
    channelName: '#coursemill-feedback',
  },
  'CenarioVR Studio & Studio Platform Services - AI Toolkit': {
    productName: 'CenarioVR',
    slackWebhook: '/api/slack-webhook/cenariovr',
    channelName: '#cenariovr-feedback',
  },
  'Review Link': {
    productName: 'Review Link',
    slackWebhook: '/api/slack-webhook/review-link',
    channelName: '#review-link-feedback',
  },
  'Asset Library Interface / Keeper': {
    productName: 'Asset Library',
    slackWebhook: '/api/slack-webhook/asset-library',
    channelName: '#asset-library-feedback',
  },
  'Spice - New Development': {
    productName: 'Spice',
    slackWebhook: '/api/slack-webhook/spice',
    channelName: '#spice-feedback',
  },
};

// Get webhook config for a product
export const getProductWebhook = (productName: string): ProductWebhookConfig | undefined => {
  return PRODUCT_WEBHOOKS[productName];
};

export default PRODUCT_WEBHOOKS;

