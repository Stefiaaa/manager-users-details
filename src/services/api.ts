import axios from 'axios';
import { User, UserFormData, Product, SlackChannel, SlackNotificationPayload, UserOperationResult, SlackChannelOperationResult } from '../types';
import { 
  sendNotifications, 
  addUserToProductChannel, 
  removeUserFromProductChannel,
  handleProductChannelChange 
} from './slackService';
import { notifyAdminOfChange, createAdminNotificationPayload } from './adminNotificationService';
import { getProductWebhook } from '../config/slackWebhooks';
import { hasProductChannel } from '../config/slackChannelConfig';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// Enable webhook notifications when proxy is configured
const USE_WEBHOOK_NOTIFICATIONS = true;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get current admin name from localStorage
const getCurrentAdminName = (): string => {
  try {
    const authData = localStorage.getItem('feedback_access_auth');
    if (authData) {
      const user = JSON.parse(authData);
      return user.name || 'Super Admin';
    }
  } catch {
    // Ignore parsing errors
  }
  return 'Super Admin';
};

// Manage Slack channel membership (add/remove user) - sends notification to product channel
const manageSlackChannelMembership = async (
  action: 'add' | 'remove',
  userEmail: string,
  userName: string,
  slackChannel: string | undefined,
  product?: string
): Promise<void> => {
  if (!slackChannel) {
    console.log(`⚠️ No Slack channel specified for ${userName}, skipping channel notification`);
    return;
  }

  const adminName = getCurrentAdminName();
  const timestamp = new Date().toLocaleString();

  // Create notification message for the product's Slack channel
  const message = action === 'add' 
    ? {
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '🔔 Slack Notifications Enabled',
              emoji: true,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*${userName}* has been added to receive Slack notifications for *${product || 'this product'}*.`,
            },
          },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*User:*\n${userName}` },
              { type: 'mrkdwn', text: `*Email:*\n${userEmail}` },
            ],
          },
          {
            type: 'context',
            elements: [
              { type: 'mrkdwn', text: `👤 Enabled by: ${adminName} | 🕐 ${timestamp}` },
            ],
          },
        ],
      }
    : {
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '🔕 Slack Notifications Disabled',
              emoji: true,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*${userName}* has been removed from Slack notifications for *${product || 'this product'}*.`,
            },
          },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*User:*\n${userName}` },
              { type: 'mrkdwn', text: `*Email:*\n${userEmail}` },
            ],
          },
          {
            type: 'context',
            elements: [
              { type: 'mrkdwn', text: `👤 Disabled by: ${adminName} | 🕐 ${timestamp}` },
            ],
          },
        ],
      };

  // Log the action
  console.log('========================================');
  console.log(action === 'add' ? '🔔 SLACK NOTIFICATIONS - Enabled' : '🔕 SLACK NOTIFICATIONS - Disabled');
  console.log('========================================');
  console.log(`👤 User: ${userName} (${userEmail})`);
  console.log(`📦 Product: ${product || 'N/A'}`);
  console.log(`💬 Notifying channel: ${slackChannel}`);

  // Send notification to the product's Slack channel via webhook proxy
  if (product && USE_WEBHOOK_NOTIFICATIONS) {
    const webhookConfig = getProductWebhook(product);
    
    if (webhookConfig) {
      try {
        console.log(`📤 Sending notification to ${webhookConfig.channelName} via ${webhookConfig.slackWebhook}...`);
        const response = await fetch(webhookConfig.slackWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(message),
          redirect: 'manual', // Don't follow redirects
        });
        
        // Check for redirect (indicates invalid webhook)
        if (response.status === 302 || response.status === 301) {
          console.warn(`⚠️ Webhook returned redirect - may be invalid`);
        } else if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Webhook error: ${response.status} - ${errorText}`);
        } else {
          console.log(`✅ Notification sent to ${webhookConfig.channelName}`);
        }
      } catch (error: any) {
        console.error(`❌ Failed to send notification: ${error.message}`);
      }
    } else {
      console.log(`⚠️ No webhook configured for product: ${product}`);
    }
  }

  console.log('========================================\n');
};

// Check if same user (email) already has access to the same product
const checkDuplicateUserProduct = async (
  email: string, 
  product: string, 
  excludeId?: string
): Promise<boolean> => {
  const response = await api.get<User[]>('/users');
  const users = response.data;
  
  // Same email + same product is not allowed (unless revoked or same record being edited)
  return users.some(user => 
    user.email.toLowerCase() === email.toLowerCase() && 
    user.product === product && 
    user.status !== 'Revoked' &&
    user.id !== excludeId
  );
};

export const userService = {
  async getAll(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  async getById(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async create(userData: UserFormData): Promise<UserOperationResult> {
    // Check: same email + same product is not allowed
    const isDuplicate = await checkDuplicateUserProduct(userData.email, userData.product);
    if (isDuplicate) {
      throw new Error(`User "${userData.email}" already has access to "${userData.product}".`);
    }

    // Track Slack channel operations
    const slackChannelOperation: SlackChannelOperationResult = {};

    // Create the new user with initial notification statuses
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      slackNotificationStatus: userData.slackNotification ? 'Pending' : 'Not Sent',
      gmailNotificationStatus: userData.gmailNotification ? 'Pending' : 'Not Sent',
    };

    // Save to database first
    const response = await api.post<User>('/users', newUser);
    const savedUser = response.data;

    // If Slack notification is enabled, add user to the product's Slack channel
    if (userData.slackNotification && userData.status !== 'Revoked') {
      // Add user to product-based Slack channel (e.g., #microbuilder for Microbuilder product)
      if (hasProductChannel(userData.product)) {
        const channelResult = await addUserToProductChannel(
          userData.email,
          userData.name,
          userData.product
        );
        if (channelResult.success) {
          console.log(`✅ User added to product channel: ${channelResult.channelName}`);
          slackChannelOperation.addedToChannel = channelResult.channelName;
        } else {
          console.warn(`⚠️ Failed to add user to product channel: ${channelResult.error}`);
          slackChannelOperation.error = channelResult.error;
        }
      }
      
      // Also send notification to the selected Slack channel (legacy behavior)
      if (userData.slackChannel) {
        await manageSlackChannelMembership('add', userData.email, userData.name, userData.slackChannel, userData.product);
      }
    }


    // Send notifications based on user preferences
    const slackPayload: SlackNotificationPayload = {
      channel: userData.slackChannel,
      action: 'user_added',
      userName: userData.name,
      userEmail: userData.email,
      product: userData.product,
      accessLevel: userData.stakeholderAccessLevel,
      performedBy: getCurrentAdminName(),
    };

    const notificationResult = await sendNotifications(
      slackPayload,
      userData.slackNotification,
      userData.gmailNotification,
      userData.email,
      userData.name
    );

    // Update user with notification statuses
    const updatedUser = await api.patch<User>(`/users/${savedUser.id}`, {
      slackNotificationStatus: userData.slackNotification
        ? (notificationResult.slackSuccess ? 'Sent' : 'Failed')
        : 'Not Sent',
      gmailNotificationStatus: userData.gmailNotification
        ? (notificationResult.gmailSuccess ? 'Sent' : 'Failed')
        : 'Not Sent',
      lastNotifiedAt: new Date().toISOString(),
    });

    // Send admin notification about this change
    const adminPayload = createAdminNotificationPayload('user_added', updatedUser.data, getCurrentAdminName());
    notifyAdminOfChange(adminPayload);

    return {
      user: updatedUser.data,
      slackChannelOperation: Object.keys(slackChannelOperation).length > 0 ? slackChannelOperation : undefined,
    };
  },

  async update(id: string, userData: Partial<UserFormData>): Promise<UserOperationResult> {
    // Get current user data for fallback values
    const currentUser = await this.getById(id);

    // Track Slack channel operations
    const slackChannelOperation: SlackChannelOperationResult = {};

    // If product is being changed, check for duplicate email + product
    if (userData.product && userData.product !== currentUser.product) {
      const emailToCheck = userData.email || currentUser.email;
      const isDuplicate = await checkDuplicateUserProduct(emailToCheck, userData.product, id);
      if (isDuplicate) {
        throw new Error(`User "${emailToCheck}" already has access to "${userData.product}".`);
      }
    }

    const shouldSendSlack = userData.slackNotification ?? currentUser.slackNotification;
    const shouldSendGmail = userData.gmailNotification ?? currentUser.gmailNotification;

    // Check if Slack notification setting is being changed
    const slackNotificationChanged = userData.slackNotification !== undefined && 
                                      userData.slackNotification !== currentUser.slackNotification;
    const slackChannelToUse = userData.slackChannel || currentUser.slackChannel;
    const newProduct = userData.product || currentUser.product;
    const oldProduct = currentUser.product;
    const productChanged = userData.product !== undefined && userData.product !== currentUser.product;
    // Ensure status is always set - use form data if provided, otherwise use current status, default to 'Active'
    const newStatus = userData.status !== undefined ? userData.status : (currentUser.status || 'Active');

    // Handle product-based Slack channel membership changes
    // Case 1: Product changed while Slack notifications are enabled
    if (productChanged && shouldSendSlack && newStatus !== 'Revoked') {
      const changeResults = await handleProductChannelChange(
        currentUser.email,
        currentUser.name,
        oldProduct,
        newProduct,
        true // Slack notifications are enabled
      );
      
      if (changeResults.removeResult?.success) {
        console.log(`✅ User removed from old product channel: ${changeResults.removeResult.channelName}`);
        slackChannelOperation.channelChangeFrom = changeResults.removeResult.channelName;
      }
      if (changeResults.addResult?.success) {
        console.log(`✅ User added to new product channel: ${changeResults.addResult.channelName}`);
        slackChannelOperation.channelChangeTo = changeResults.addResult.channelName;
      }
    }
    
    // Case 2: Slack notification setting changed (enabled/disabled)
    if (slackNotificationChanged && newStatus !== 'Revoked') {
      if (shouldSendSlack) {
        // User enabled Slack notifications - add to product channel
        if (hasProductChannel(newProduct)) {
          const addResult = await addUserToProductChannel(currentUser.email, currentUser.name, newProduct);
          if (addResult.success) {
            console.log(`✅ User added to product channel: ${addResult.channelName}`);
            slackChannelOperation.addedToChannel = addResult.channelName;
          } else {
            slackChannelOperation.error = addResult.error;
          }
        }
      } else {
        // User disabled Slack notifications - remove from product channel
        if (hasProductChannel(newProduct)) {
          const removeResult = await removeUserFromProductChannel(currentUser.email, currentUser.name, newProduct);
          if (removeResult.success) {
            console.log(`✅ User removed from product channel: ${removeResult.channelName}`);
            slackChannelOperation.removedFromChannel = removeResult.channelName;
          } else {
            slackChannelOperation.error = removeResult.error;
          }
        }
      }
    }

    // Manage legacy Slack channel membership if notification preference changed
    if (slackNotificationChanged && slackChannelToUse) {
      const productToUse = userData.product || currentUser.product;
      if (userData.slackNotification) {
        // User enabled Slack notifications - add to channel
        await manageSlackChannelMembership('add', currentUser.email, currentUser.name, slackChannelToUse, productToUse);
      } else {
        // User disabled Slack notifications - remove from channel
        await manageSlackChannelMembership('remove', currentUser.email, currentUser.name, slackChannelToUse, productToUse);
      }
    }


    // Prepare update data with pending notification status
    const updateData = {
      ...userData,
      slackNotificationStatus: shouldSendSlack ? 'Pending' as const : 'Not Sent' as const,
      gmailNotificationStatus: shouldSendGmail ? 'Pending' as const : 'Not Sent' as const,
    };

    // Update in database first
    const response = await api.patch<User>(`/users/${id}`, updateData);
    const updatedUser = response.data;

    // Send notifications based on user preferences
    const slackPayload: SlackNotificationPayload = {
      channel: updatedUser.slackChannel,
      action: 'user_updated',
      userName: updatedUser.name,
      userEmail: updatedUser.email,
      product: updatedUser.product,
      accessLevel: updatedUser.stakeholderAccessLevel,
      performedBy: getCurrentAdminName(),
    };

    const notificationResult = await sendNotifications(
      slackPayload,
      updatedUser.slackNotification,
      updatedUser.gmailNotification,
      updatedUser.email,
      updatedUser.name
    );

    // Update notification statuses
    const finalUser = await api.patch<User>(`/users/${id}`, {
      slackNotificationStatus: updatedUser.slackNotification
        ? (notificationResult.slackSuccess ? 'Sent' : 'Failed')
        : 'Not Sent',
      gmailNotificationStatus: updatedUser.gmailNotification
        ? (notificationResult.gmailSuccess ? 'Sent' : 'Failed')
        : 'Not Sent',
      lastNotifiedAt: new Date().toISOString(),
    });

    // Send admin notification about this change
    const adminPayload = createAdminNotificationPayload('user_updated', finalUser.data, getCurrentAdminName());
    notifyAdminOfChange(adminPayload);

    return {
      user: finalUser.data,
      slackChannelOperation: Object.keys(slackChannelOperation).length > 0 ? slackChannelOperation : undefined,
    };
  },

  async revoke(id: string): Promise<User> {
    // Get current user data
    const currentUser = await this.getById(id);

    // If user had Slack notifications enabled, remove them from the product channel
    if (currentUser.slackNotification) {
      // Remove from product-based Slack channel
      if (hasProductChannel(currentUser.product)) {
        const removeResult = await removeUserFromProductChannel(
          currentUser.email,
          currentUser.name,
          currentUser.product
        );
        if (removeResult.success) {
          console.log(`✅ User removed from product channel on revoke: ${removeResult.channelName}`);
        }
      }
      
      // Also remove from legacy selected channel
      if (currentUser.slackChannel) {
        await manageSlackChannelMembership('remove', currentUser.email, currentUser.name, currentUser.slackChannel, currentUser.product);
      }
    }

    // Send revocation notifications BEFORE updating (use current preferences)
    const slackPayload: SlackNotificationPayload = {
      channel: currentUser.slackChannel,
      action: 'access_revoked',
      userName: currentUser.name,
      userEmail: currentUser.email,
      product: currentUser.product,
      accessLevel: 'N/A', // Revoked - no access
      performedBy: getCurrentAdminName(),
    };

    // Send revocation notifications
    await sendNotifications(
      slackPayload,
      currentUser.slackNotification,
      currentUser.gmailNotification,
      currentUser.email,
      currentUser.name
    );

    // Update status to Revoked and set fields to N/A
    const finalUser = await api.patch<User>(`/users/${id}`, {
      status: 'Revoked',
      stakeholderAccessLevel: 'N/A',
      slackNotification: false,
      gmailNotification: false,
      slackNotificationStatus: 'N/A',
      gmailNotificationStatus: 'N/A',
      lastNotifiedAt: new Date().toISOString(),
    });

    // Send admin notification about this change
    const adminPayload = createAdminNotificationPayload('access_revoked', finalUser.data, getCurrentAdminName());
    notifyAdminOfChange(adminPayload);

    return finalUser.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  // Retry sending notification for a user
  async retryNotification(id: string, type: 'slack' | 'gmail'): Promise<User> {
    const user = await this.getById(id);

    if (type === 'slack') {
      const slackPayload: SlackNotificationPayload = {
        channel: user.slackChannel,
        action: 'user_updated',
        userName: user.name,
        userEmail: user.email,
        product: user.product,
        accessLevel: user.stakeholderAccessLevel,
        performedBy: getCurrentAdminName(),
      };

      const notificationResult = await sendNotifications(slackPayload, true, false, user.email, user.name);

      const updatedUser = await api.patch<User>(`/users/${id}`, {
        slackNotificationStatus: notificationResult.slackSuccess ? 'Sent' : 'Failed',
        lastNotifiedAt: new Date().toISOString(),
      });

      return updatedUser.data;
    }

    if (type === 'gmail') {
      const slackPayload: SlackNotificationPayload = {
        channel: user.slackChannel,
        action: 'user_updated',
        userName: user.name,
        userEmail: user.email,
        product: user.product,
        accessLevel: user.stakeholderAccessLevel,
        performedBy: getCurrentAdminName(),
      };

      const notificationResult = await sendNotifications(slackPayload, false, true, user.email, user.name);

      const updatedUser = await api.patch<User>(`/users/${id}`, {
        gmailNotificationStatus: notificationResult.gmailSuccess ? 'Sent' : 'Failed',
        lastNotifiedAt: new Date().toISOString(),
      });

      return updatedUser.data;
    }

    return user;
  },
};

export const productService = {
  async getAll(): Promise<Product[]> {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },
};

export const slackChannelService = {
  async getAll(): Promise<SlackChannel[]> {
    const response = await api.get<SlackChannel[]>('/slackChannels');
    return response.data;
  },
};

export default api;
