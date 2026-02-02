# Product User Access Manager

A React.js web application for managing product feedback access. This app is used by Super Admins (PMs) to manage users and their access permissions, with automatic Slack and Gmail notifications when changes are made.

## Features

### 1. User Management (List Page)
- Display users in a data table with columns:
  - Name
  - Email
  - Product
  - Sheet Access Level (View / Edit / None)
  - Slack Channel
  - Status (Active / Revoked)
  - Slack Notification Status
  - Gmail Notification Status
  - Created At (formatted date)
  - Actions (Edit | Revoke)

### 2. Add User
- Modal form with fields:
  - Name (with validation)
  - Email (with email format validation)
  - Product (dropdown)
  - Stakeholder Sheet Access Level (View / Edit / None)
  - Slack Channel (dropdown)
  - Gmail Notification toggle
- Auto-sets `Created At` timestamp on submit
- Sends Slack notification to the selected channel
- Optionally sends Gmail notification to the user

### 3. Update User
- Edit button in Actions column
- Pre-filled form with current user data
- Allows updating:
  - Product
  - Stakeholder Sheet Access Level
  - Slack Channel
  - Gmail Notification setting
  - Status
- Sends notifications on update

### 4. Delete / Revoke Access
- "Revoke" action (soft delete)
- Changes Status to "Revoked"
- Confirmation dialog before revoke
- Sends revocation notifications via Slack and Gmail

### 5. Notifications
- **Slack**: Automatic notifications to the selected Slack channel when:
  - User is added
  - User access is updated
  - User access is revoked
- **Gmail**: Optional email notifications to the user when enabled
- Notification status tracking (Sent / Failed / Pending / Not Sent)

## Tech Stack

- **React** (functional components + hooks)
- **TypeScript**
- **UI**: Material UI (MUI)
- **State Management**: Redux Toolkit
- **API Layer**: JSON Server (mock REST API)
- **Date Handling**: dayjs
- **Notifications**: notistack (toast notifications)

## UX Features

- Search by Name / Email
- Filter by Product and Status
- Pagination
- Loading and empty states
- Success & error toasts
- Form validation with visual feedback
- Responsive design

## Roles & Rules

- Only Super Admin (PMs) can:
  - Add users
  - Edit users
  - Revoke user access
- No self-registration

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Running the Application

```bash
# Start both the React app and JSON Server (mock API)
npm run dev
```

This will start:
- React development server at `http://localhost:3000`
- JSON Server (mock API) at `http://localhost:3001`

## Sharing Without Code (Recommended)

You can share a **live link** to your manager without sharing source code by deploying the production build.

### 1) Build the app

```bash
npm run build
```

This creates a production-ready `build/` folder (no source code).

### 2) Host the frontend (Vercel / Netlify / Static host)

Deploy the `build/` folder to any static host.  
Set this environment variable in the hosting platform:

```env
REACT_APP_API_BASE_URL=https://your-json-server-url
```

### 3) Host the mock API (JSON Server)

The app uses a JSON Server API. For sharing, host it separately (for example on Render):

- Create a small repo that contains only `db.json`
- Add `json-server` and a start script
- Deploy and use the public URL as `REACT_APP_API_BASE_URL`

This keeps the UI source private and only shares the built app.

### Demo Credentials

Use the following credentials to log in:

- **Email**: `stefia.a@elblearning.com`
- **Password**: `admin123`

Or:
- **Email**: `pm@elblearning.com`
- **Password**: `pm123`

## Project Structure

```
src/
├── components/         # React components
│   ├── FilterBar.tsx     # Search and filter controls
│   ├── Header.tsx        # App header with user info
│   ├── LoginPage.tsx     # Login form
│   ├── RevokeConfirmDialog.tsx  # Revoke confirmation modal
│   ├── UserFormModal.tsx # Add/Edit user form
│   └── UserTable.tsx     # Users data table
├── config/
│   └── credentials.ts    # Admin credentials configuration
├── context/
│   └── AuthContext.tsx   # Authentication context
├── services/
│   ├── api.ts            # API service layer
│   └── slackService.ts   # Slack & Gmail notification service
├── store/
│   ├── hooks.ts          # Redux hooks
│   ├── index.ts          # Store configuration
│   └── userSlice.ts      # User state management
├── types/
│   └── index.ts          # TypeScript type definitions
├── App.tsx               # Main application component
├── index.tsx             # Application entry point
└── theme.ts              # MUI theme configuration
```

## API Endpoints (JSON Server)

- `GET /users` - Get all users
- `POST /users` - Create a new user
- `PATCH /users/:id` - Update a user
- `DELETE /users/:id` - Delete a user
- `GET /products` - Get all products
- `GET /slackChannels` - Get all Slack channels

## Slack & Gmail Integration (Production)

Slack and Gmail are handled by the backend proxy (Render). The frontend calls the proxy via:

- `REACT_APP_PROXY_BASE_URL=https://your-render-url.onrender.com`

### Backend Environment Variables (Render)

Set only the tokens you need:

```
SLACK_WEBHOOK_TOKEN_ADMIN=...
SLACK_BOT_TOKEN_MICROBUILDER=...
SLACK_WEBHOOK_TOKEN_MICROBUILDER=...
# ... other products as needed
GMAIL_APPS_SCRIPT_URL=https://script.google.com/macros/s/your-script-id/exec
```

## Scripts

- `npm start` - Start React development server only
- `npm run server` - Start JSON Server only
- `npm run dev` - Start both servers concurrently
- `npm run build` - Build for production
- `npm test` - Run tests

## Adding New Admin Users

Edit `src/config/credentials.ts` to add new admin users:

```typescript
export const ADMIN_USERS: AdminUser[] = [
  {
    email: 'your.email@elblearning.com',
    password: 'yourpassword',
    name: 'Your Name',
  },
  // Add more admins here
];
```

## License

This project is private and for internal use only.
