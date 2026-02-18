import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, CircularProgress, Paper, Typography } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Lock as LockIcon } from '@mui/icons-material';
import {
  FEEDBACK_FORM_URL,
  isFormAccessValid,
  refreshFormAccessSession,
} from '../utils/feedbackFormAccess';

const FeedbackFormPage: React.FC = () => {
  const [accessGranted, setAccessGranted] = useState<boolean | null>(null);

  const token = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('token');
  }, []);

  useEffect(() => {
    if (token && isFormAccessValid(token)) {
      refreshFormAccessSession(token);
      setAccessGranted(true);
      window.history.replaceState(null, '', '/feedback-form');
      return;
    }
    setAccessGranted(false);
  }, [token]);

  const handleBack = () => {
    window.location.assign('/');
  };

  if (accessGranted === null) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        }}
      >
        <CircularProgress sx={{ color: 'white' }} size={48} />
      </Box>
    );
  }

  if (!accessGranted) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #f0f4f8 0%, #e2e8f0 100%)',
          px: 2,
        }}
      >
        <Paper
          sx={{
            maxWidth: 520,
            p: 4,
            borderRadius: 3,
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
          }}
        >
          <LockIcon sx={{ fontSize: 40, color: 'error.main', mb: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Access blocked
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            This form can only be opened from within the product environment.
            Direct access or shared links are not allowed.
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Back to Dashboard
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f0f4f8 0%, #e2e8f0 100%)' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, md: 4 },
          py: 2,
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        }}
      >
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
          Product Feedback Form
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            color: 'white',
            borderColor: 'rgba(255,255,255,0.4)',
            textTransform: 'none',
            '&:hover': {
              borderColor: 'rgba(255,255,255,0.8)',
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          Back
        </Button>
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        <Paper
          sx={{
            mb: 2.5,
            p: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(102, 126, 234, 0.08)',
            border: '1px solid rgba(102, 126, 234, 0.25)',
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            This form is restricted to authenticated users inside the product. If you copy and paste
            the Google Form link outside this environment, it will be blocked by domain access
            settings.
          </Typography>
        </Paper>
        <Paper
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
          }}
        >
          <Box
            component="iframe"
            title="Product Feedback Form"
            src={FEEDBACK_FORM_URL}
            sx={{ width: '100%', height: '80vh', border: 'none' }}
            referrerPolicy="no-referrer"
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default FeedbackFormPage;
