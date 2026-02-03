// =====================================================
// 🔐 ADMIN CREDENTIALS - UPDATE HERE ONLY
// =====================================================
// Add, remove, or modify admin users below.
// Changes here will automatically update:
//   - Login validation
//   - Demo credentials shown on login page
// =====================================================

export interface AdminUser {
  email: string;
  password: string;
  name: string;
}

export const ADMIN_USERS: AdminUser[] = [
  {
    email: 'neha.g@elblearning.com',
    password: 'admin123',
    name: 'Super Admin',
  },
  {
    email: 'pm@elblearning.com',
    password: 'pm123',
    name: 'Product Manager',
  },
  // Add more admins here:
  // {
  //   email: 'your.email@elblearning.com',
  //   password: 'yourpassword',
  //   name: 'Your Name',
  // },
];

// Default credentials to show on login page (uses first admin)
export const DEFAULT_DEMO_CREDENTIALS = ADMIN_USERS[0];

