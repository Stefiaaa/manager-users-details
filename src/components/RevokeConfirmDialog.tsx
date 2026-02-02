import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { User } from '../types';

interface RevokeConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  user: User | null;
  loading: boolean;
}

const RevokeConfirmDialog: React.FC<RevokeConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  user,
  loading,
}) => {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <WarningIcon />
        <Typography variant="h6" fontWeight={700}>
          Confirm Access Revocation
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {user && (
          <Box>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to revoke access for:
            </Typography>

            <Box
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: 'grey.100',
                borderRadius: 2,
                borderLeft: '4px solid',
                borderColor: 'error.main',
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Product: {user.product}
              </Typography>
            </Box>

            <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
              This action will remove the user's access to the feedback sheet. A notification will be
              sent to <strong>{user.slackChannel}</strong>.
            </Alert>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          sx={{
            borderRadius: 2,
            px: 3,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Revoke Access'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RevokeConfirmDialog;

