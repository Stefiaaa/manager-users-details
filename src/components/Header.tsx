import React from 'react';
import { Box, Typography, Chip, Button, Avatar } from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  Feedback as FeedbackIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  // onOpenFeedbackForm?: () => void;  // feedback form – commented out
}

const Header: React.FC<HeaderProps> = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        py: 3,
        px: 4,
        mb: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(118, 75, 162, 0.15) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Box
        sx={{
          maxWidth: 1400,
          mx: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
            }}
          >
            <FeedbackIcon sx={{ fontSize: 28, color: 'white' }} />
          </Box>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
              }}
            >
              User Access Manager
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                mt: 0.25,
                letterSpacing: '0.5px',
              }}
            >
              Manage product feedback sheet access and permissions
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* User info */}
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                {getInitials(user.name)}
              </Avatar>
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Typography
                  variant="body2"
                  sx={{ color: 'white', fontWeight: 600, lineHeight: 1.2 }}
                >
                  {user.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  {user.email}
                </Typography>
              </Box>
            </Box>
          )}

          <Chip
            icon={<AdminIcon sx={{ color: 'white !important' }} />}
            label="Super Admin"
            sx={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              fontWeight: 600,
              px: 1,
              py: 2.5,
              fontSize: '0.875rem',
              boxShadow: '0 4px 14px rgba(240, 147, 251, 0.4)',
              '& .MuiChip-icon': {
                color: 'white',
              },
              display: { xs: 'none', sm: 'flex' },
            }}
          />

          {/* Feedback form button – commented out
          {onOpenFeedbackForm && (
            <Button
              variant="contained"
              startIcon={<FeedbackIcon />}
              onClick={onOpenFeedbackForm}
              sx={{ ... }}
            >
              Feedback Form
            </Button>
          )}
          */}

          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.6)',
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
