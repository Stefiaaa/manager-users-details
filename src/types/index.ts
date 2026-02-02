export type StakeholderAccessLevel = 'View' | 'Edit' | 'None' | 'N/A';
export type UserStatus = 'Active' | 'Revoked';
export type NotificationStatus = 'Pending' | 'Sent' | 'Failed' | 'Not Sent' | 'N/A';

export interface User {
  id: string;
  name: string;
  email: string;
  product: string;
  stakeholderAccessLevel: StakeholderAccessLevel;
  slackChannel: string;
  status: UserStatus;
  createdAt: string;
  // Notification settings
  slackNotification: boolean;
  gmailNotification: boolean;
  // Notification statuses
  slackNotificationStatus: NotificationStatus;
  gmailNotificationStatus: NotificationStatus;
  lastNotifiedAt?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  product: string;
  stakeholderAccessLevel: StakeholderAccessLevel;
  slackChannel: string;
  status: UserStatus;
  slackNotification: boolean;
  gmailNotification: boolean;
}

export interface Product {
  id: string;
  name: string;
}

export interface SlackChannel {
  id: string;
  name: string;
  webhookUrl?: string; // Optional webhook URL for real Slack integration
}

export interface UsersState {
  users: User[];
  products: Product[];
  slackChannels: SlackChannel[];
  loading: boolean;
  error: string | null;
}

export interface TableFilters {
  search: string;
  product: string;
  status: string;
}

export interface PaginationState {
  page: number;
  rowsPerPage: number;
}

// Notification types
export interface SlackNotificationPayload {
  channel: string;
  action: 'user_added' | 'user_updated' | 'access_revoked';
  userName: string;
  userEmail: string;
  product: string;
  accessLevel: StakeholderAccessLevel;
  performedBy?: string;
}

export interface NotificationResult {
  slackSuccess: boolean;
  gmailSuccess: boolean;
  slackError?: string;
  gmailError?: string;
}

// Slack channel membership operation result
export interface SlackChannelOperationResult {
  addedToChannel?: string;
  removedFromChannel?: string;
  channelChangeFrom?: string;
  channelChangeTo?: string;
  error?: string;
}

// Extended user result with operation details
export interface UserOperationResult {
  user: User;
  slackChannelOperation?: SlackChannelOperationResult;
}