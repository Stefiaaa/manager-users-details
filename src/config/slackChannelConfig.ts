/**
 * Slack Channel Configuration for Product-based Membership
 * Maps product names to their corresponding Slack channels for automatic membership management
 * Channel names must match exactly what's in your Slack workspace (without the #)
 */

import type { SlackChannel } from '../types';

export interface ProductChannelMapping {
  productName: string;
  channelId: string;
  channelName: string;
}

// Product to Slack Channel mapping for membership management
// These channel names match the slackChannels in db.json
export const PRODUCT_CHANNEL_MAP: Record<string, ProductChannelMapping> = {
  'MicroBuilder': {
    productName: 'MicroBuilder',
    channelId: 'C0A5XCEF41Z',
    channelName: '#elb-microbuilder-feedback',
  },
  'Lectora Online': {
    productName: 'Lectora Online',
    channelId: 'lectora-online-feedback',
    channelName: '#lectora-online-feedback',
  },
  'Lectora Desktop': {
    productName: 'Lectora Desktop',
    channelId: 'lectora-desktop-feedback',
    channelName: '#lectora-desktop-feedback',
  },
  'The Training Arcade': {
    productName: 'The Training Arcade',
    channelId: 'the-training-arcade-feedback',
    channelName: '#the-training-arcade-feedback',
  },
  'Rehearsal & RolePlay': {
    productName: 'Rehearsal & RolePlay',
    channelId: 'rehearsal-roleplay-feedback',
    channelName: '#rehearsal-roleplay-feedback',
  },
  'Rockstar Learning Platform': {
    productName: 'Rockstar Learning Platform',
    channelId: 'rockstar-learning-platform-feedback',
    channelName: '#rockstar-learning-platform-feedback',
  },
  'CourseMill': {
    productName: 'CourseMill',
    channelId: 'coursemill-feedback',
    channelName: '#coursemill-feedback',
  },
  'CenarioVR Studio & Studio Platform Services - AI Toolkit': {
    productName: 'CenarioVR',
    channelId: 'cenariovr-feedback',
    channelName: '#cenariovr-feedback',
  },
  'Review Link': {
    productName: 'Review Link',
    channelId: 'review-link-feedback',
    channelName: '#review-link-feedback',
  },
  'Asset Library Interface / Keeper': {
    productName: 'Asset Library',
    channelId: 'asset-library-feedback',
    channelName: '#asset-library-feedback',
  },
  'Spice - New Development': {
    productName: 'Spice',
    channelId: 'spice-feedback',
    channelName: '#spice-feedback',
  },
};

/**
 * Get channel mapping for a product
 */
export const getProductChannel = (productName: string): ProductChannelMapping | undefined => {
  return PRODUCT_CHANNEL_MAP[productName];
};

/**
 * Check if a product has a Slack channel mapping
 */
export const hasProductChannel = (productName: string): boolean => {
  return productName in PRODUCT_CHANNEL_MAP;
};

/**
 * Get channel name for a product (returns undefined if not mapped)
 */
export const getProductChannelName = (productName: string): string | undefined => {
  const mapping = PRODUCT_CHANNEL_MAP[productName];
  return mapping?.channelName;
};

/**
 * Get channel ID for a product (returns undefined if not mapped)
 */
export const getProductChannelId = (productName: string): string | undefined => {
  const mapping = PRODUCT_CHANNEL_MAP[productName];
  return mapping?.channelId;
};

/**
 * Fallback list of Slack channels when API /slackChannels is unavailable.
 * Used so the Add/Edit User form always has channel options.
 */
export const getFallbackSlackChannels = (): SlackChannel[] => {
  return Object.values(PRODUCT_CHANNEL_MAP).map((m, i) => ({
    id: String(i + 1),
    name: m.channelName,
  }));
};

export default PRODUCT_CHANNEL_MAP;
