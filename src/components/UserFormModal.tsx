import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  LinearProgress,
  Tooltip,
  InputAdornment,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  NotificationsActive as NotificationIcon,
  Email as EmailIcon,
  Tag as SlackIcon,
  GroupAdd as GroupAddIcon,
  SwapHoriz as SwapIcon,
} from '@mui/icons-material';
import { User, UserFormData, Product, SlackChannel } from '../types';
import { hasProductChannel, getProductChannelName } from '../config/slackChannelConfig';

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
  user?: User | null;
  products: Product[];
  slackChannels: SlackChannel[];
  loading: boolean;
  existingEmails?: string[];
}

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

const initialFormData: UserFormData = {
  name: '',
  email: '',
  product: '',
  stakeholderAccessLevel: 'None',
  slackChannel: '',
  status: 'Active',
  slackNotification: false,
  gmailNotification: false,
};

// Validation rules for string fields
const validationRules: Record<string, ValidationRule[]> = {
  name: [
    { test: (v) => v.trim().length > 0, message: 'Name is required' },
    { test: (v) => v.trim().length >= 2, message: 'Name must be at least 2 characters' },
    { test: (v) => v.trim().length <= 50, message: 'Name must be less than 50 characters' },
    { test: (v) => /^[a-zA-Z\s'-]+$/.test(v.trim()), message: 'Name can only contain letters, spaces, hyphens, and apostrophes' },
  ],
  email: [
    { test: (v) => v.trim().length > 0, message: 'Email is required' },
    { test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Please enter a valid email address' },
    { test: (v) => v.length <= 100, message: 'Email must be less than 100 characters' },
    { test: (v) => !v.includes('..'), message: 'Email cannot contain consecutive dots' },
  ],
  product: [
    { test: (v) => v.length > 0, message: 'Please select a product' },
  ],
  stakeholderAccessLevel: [
    { test: (v) => ['View', 'Edit', 'None'].includes(v), message: 'Please select an access level' },
  ],
  slackChannel: [
    // Slack channel is optional
  ],
  status: [
    { test: (v) => ['Active', 'Revoked'].includes(v), message: 'Please select a status' },
  ],
};

const UserFormModal: React.FC<UserFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  user,
  products,
  slackChannels,
  loading,
  existingEmails = [],
}) => {
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [touched, setTouched] = useState<Record<string, boolean>>({
    name: false,
    email: false,
    product: false,
    stakeholderAccessLevel: false,
    slackChannel: false,
    status: false,
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const isEditMode = Boolean(user);

  // Reset form when modal opens/closes or user changes
  useEffect(() => {
    if (open) {
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          product: user.product,
          stakeholderAccessLevel: user.stakeholderAccessLevel || 'None',
          slackChannel: user.slackChannel,
          status: user.status,
          slackNotification: user.slackNotification ?? false,
          gmailNotification: user.gmailNotification ?? false,
        });
      } else {
        setFormData(initialFormData);
      }
      setTouched({
        name: false,
        email: false,
        product: false,
        stakeholderAccessLevel: false,
        slackChannel: false,
        status: false,
      });
      setErrors({});
      setSubmitAttempted(false);
    }
  }, [user, open]);

  // Validate a single field
  const validateField = useCallback((field: string, value: string): string => {
    const rules = validationRules[field];
    if (!rules) return '';
    
    for (const rule of rules) {
      if (!rule.test(value)) {
        return rule.message;
      }
    }

    return '';
  }, []);

  // Validate all fields
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<string, string>> = {};
    let isValid = true;

    const fieldsToValidate = ['name', 'email', 'product', 'stakeholderAccessLevel', 'status'];
    
    fieldsToValidate.forEach((field) => {
      // Skip name and email validation in edit mode (they're disabled)
      if (isEditMode && (field === 'name' || field === 'email')) {
        return;
      }
      
      const value = (formData as any)[field] as string;
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // Validate: If Slack notification is enabled, Slack channel must be selected
    if (formData.slackNotification && !formData.slackChannel) {
      newErrors.slackChannel = 'Please select a Slack channel when Slack notification is enabled';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [formData, isEditMode, validateField]);

  // Handle field blur
  const handleBlur = (field: string) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = (formData as any)[field] as string;
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error || undefined }));
  };

  // Handle field change
  const handleChange = (field: keyof UserFormData) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }> | any
  ) => {
    const value = event.target.value as string;
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field] || submitAttempted) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error || undefined }));
    }
    
    // Clear slack channel error when a channel is selected
    if (field === 'slackChannel' && value) {
      setErrors((prev) => ({ ...prev, slackChannel: undefined }));
    }
  };

  // Handle switch change
  const handleSwitchChange = (field: keyof UserFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = event.target.checked;
    setFormData((prev) => ({ ...prev, [field]: checked }));
    
    // If disabling Slack notification, clear the Slack channel error
    if (field === 'slackNotification' && !checked) {
      setErrors((prev) => ({ ...prev, slackChannel: undefined }));
    }
    // If enabling Slack notification without a channel selected, show error
    if (field === 'slackNotification' && checked && !formData.slackChannel) {
      setErrors((prev) => ({ ...prev, slackChannel: 'Please select a Slack channel when Slack notification is enabled' }));
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setSubmitAttempted(true);
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      product: true,
      stakeholderAccessLevel: true,
      slackChannel: true,
      status: true,
    });

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      // Error is handled by parent component
    }
  };

  // Calculate form completion percentage
  const getCompletionPercentage = (): number => {
    const fieldsToCheck = isEditMode 
      ? ['product', 'stakeholderAccessLevel', 'slackChannel', 'status']
      : ['name', 'email', 'product', 'stakeholderAccessLevel', 'slackChannel'];

    let filledCount = 0;
    fieldsToCheck.forEach((field) => {
      const value = (formData as any)[field];
      if (value && String(value).trim().length > 0) {
        filledCount++;
      }
    });

    return Math.round((filledCount / fieldsToCheck.length) * 100);
  };

  // Get field status icon
  const getFieldStatus = (field: string): React.ReactNode => {
    if (!touched[field] && !submitAttempted) return null;
    
    const value = (formData as any)[field] as string;
    const error = validateField(field, value);
    
    if (error) {
      return (
        <Tooltip title={error}>
          <ErrorIcon color="error" fontSize="small" />
        </Tooltip>
      );
    }
    
    if (value && value.trim().length > 0) {
      return <CheckIcon color="success" fontSize="small" />;
    }
    
    return null;
  };

  const completionPercentage = getCompletionPercentage();

  // Get all validation errors for summary
  const getValidationSummary = (): string[] => {
    const allErrors: string[] = [];
    const fieldsToValidate = isEditMode 
      ? ['product', 'stakeholderAccessLevel', 'slackChannel', 'status']
      : ['name', 'email', 'product', 'stakeholderAccessLevel', 'slackChannel'];
    
    fieldsToValidate.forEach((field) => {
      const value = (formData as any)[field] as string;
      const error = validateField(field, value);
      if (error) {
        allErrors.push(error);
      }
    });
    
    return allErrors;
  };

  const validationErrors = submitAttempted ? getValidationSummary() : [];

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 2,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            {isEditMode ? 'Edit User Access' : 'Add New User'}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            {isEditMode
              ? 'Update user product feedback access details'
              : 'Grant a new user access to product feedback'}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          disabled={loading}
          sx={{
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        {/* Form Completion Progress */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Form Completion
            </Typography>
            <Typography variant="caption" fontWeight={600} color={completionPercentage === 100 ? 'success.main' : 'primary.main'}>
              {completionPercentage}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={completionPercentage}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                background: completionPercentage === 100
                  ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Product Field - First */}
          <FormControl
            fullWidth
            error={Boolean(errors.product) && (touched.product || submitAttempted)}
            required
          >
            <InputLabel>Product</InputLabel>
            <Select
              value={formData.product}
              onChange={handleChange('product')}
              onBlur={handleBlur('product')}
              label="Product"
              sx={{ borderRadius: 2 }}
              endAdornment={
                <InputAdornment position="end" sx={{ mr: 2 }}>
                  {getFieldStatus('product')}
                </InputAdornment>
              }
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.name}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
            <Typography
              variant="caption"
              color={(touched.product || submitAttempted) && errors.product ? 'error' : 'text.secondary'}
              sx={{ mt: 0.5, ml: 1.5 }}
            >
              {(touched.product || submitAttempted) && errors.product
                ? errors.product
                : 'Select the product for feedback access'}
            </Typography>
          </FormControl>

          {/* Name Field */}
          <TextField
            label="Name"
            value={formData.name}
            onChange={handleChange('name')}
            onBlur={handleBlur('name')}
            fullWidth
            required
            disabled={isEditMode}
            error={Boolean(errors.name) && (touched.name || submitAttempted)}
            helperText={
              (touched.name || submitAttempted) && errors.name
                ? errors.name
                : 'Enter the user\'s full name'
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {getFieldStatus('name')}
                </InputAdornment>
              ),
              sx: { borderRadius: 2 },
            }}
          />

          {/* Email Field */}
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            fullWidth
            required
            disabled={isEditMode}
            error={Boolean(errors.email) && (touched.email || submitAttempted)}
            helperText={
              (touched.email || submitAttempted) && errors.email
                ? errors.email
                : 'Enter a valid email address'
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {getFieldStatus('email')}
                </InputAdornment>
              ),
              sx: { borderRadius: 2 },
            }}
          />

          {/* Stakeholder Access Level Field */}
          <FormControl fullWidth required>
            <InputLabel>Stakeholder Sheet Access Level</InputLabel>
            <Select
              value={formData.stakeholderAccessLevel}
              onChange={handleChange('stakeholderAccessLevel')}
              label="Stakeholder Sheet Access Level"
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="None">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'grey.400',
                    }}
                  />
                  <Box>
                    <Typography variant="body2">No Access</Typography>
                    <Typography variant="caption" color="text.secondary">
                      No stakeholder sheet access
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem value="View">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'info.main',
                    }}
                  />
                  <Box>
                    <Typography variant="body2">View Only</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Can view stakeholder data but cannot modify
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem value="Edit">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'warning.main',
                    }}
                  />
                  <Box>
                    <Typography variant="body2">Full Edit Access</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Can view and modify stakeholder data
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            </Select>

          </FormControl>

          {/* Slack Channel Field */}
          <FormControl
            fullWidth
          >
            <InputLabel>Slack Channel (Optional)</InputLabel>
            <Select
              value={formData.slackChannel}
              onChange={handleChange('slackChannel')}
              onBlur={handleBlur('slackChannel')}
              label="Slack Channel (Optional)"
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {slackChannels.map((channel) => (
                <MenuItem key={channel.id} value={channel.name}>
                  <Typography sx={{ fontFamily: 'monospace' }}>{channel.name}</Typography>
                </MenuItem>
              ))}
            </Select>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5, ml: 1.5 }}
            >
              Select a Slack channel for notifications (optional)
            </Typography>
          </FormControl>

          {/* Notification Settings Section */}
          <Divider sx={{ my: 1 }} />
          
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <NotificationIcon sx={{ color: 'primary.main' }} />
              <Typography variant="subtitle2" fontWeight={600}>
                Notification Settings
              </Typography>
            </Box>

            {/* Slack Notification Toggle */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: 'grey.50',
                border: '1px solid',
                borderColor: formData.slackNotification ? 'secondary.main' : 'grey.200',
                transition: 'all 0.2s ease',
                mb: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.slackNotification}
                    onChange={handleSwitchChange('slackNotification')}
                    color="secondary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SlackIcon fontSize="small" color={formData.slackNotification ? 'secondary' : 'disabled'} />
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        Slack Notification
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formData.slackChannel 
                          ? `Send notification to ${formData.slackChannel} when access changes`
                          : 'Select a Slack channel above to enable notifications'}
                      </Typography>
                    </Box>
                  </Box>
                }
                sx={{ m: 0, width: '100%' }}
              />

              {/* Product-based Slack Channel Membership Indicator */}
              {formData.slackNotification && formData.product && hasProductChannel(formData.product) && formData.status !== 'Revoked' && (
                <Box
                  sx={{
                    mt: 2,
                    p: 1.5,
                    borderRadius: 1.5,
                    backgroundColor: 'secondary.50',
                    border: '1px dashed',
                    borderColor: 'secondary.300',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <GroupAddIcon fontSize="small" sx={{ color: 'secondary.main' }} />
                  <Box>
                    <Typography variant="caption" fontWeight={600} color="secondary.dark">
                      Auto Channel Membership
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      User will be added to <strong>{getProductChannelName(formData.product)}</strong> Slack channel
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Product Change Warning */}
              {isEditMode && user && formData.slackNotification && formData.product && 
               user.product !== formData.product && 
               hasProductChannel(user.product) && hasProductChannel(formData.product) && 
               formData.status !== 'Revoked' && (
                <Box
                  sx={{
                    mt: 2,
                    p: 1.5,
                    borderRadius: 1.5,
                    backgroundColor: 'warning.50',
                    border: '1px dashed',
                    borderColor: 'warning.300',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <SwapIcon fontSize="small" sx={{ color: 'warning.main' }} />
                  <Box>
                    <Typography variant="caption" fontWeight={600} color="warning.dark">
                      Channel Membership Change
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      User will be moved from <strong>{getProductChannelName(user.product)}</strong> to <strong>{getProductChannelName(formData.product)}</strong>
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Gmail Notification Toggle */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: 'grey.50',
                border: '1px solid',
                borderColor: formData.gmailNotification ? 'primary.main' : 'grey.200',
                transition: 'all 0.2s ease',
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.gmailNotification}
                    onChange={handleSwitchChange('gmailNotification')}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon fontSize="small" color={formData.gmailNotification ? 'primary' : 'disabled'} />
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        Gmail Notification
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Send email notification to user when access changes
                      </Typography>
                    </Box>
                  </Box>
                }
                sx={{ m: 0, width: '100%' }}
              />

              {/* Gmail Notification Indicator */}
              {formData.gmailNotification && formData.email && formData.status !== 'Revoked' && (
                <Box
                  sx={{
                    mt: 2,
                    p: 1.5,
                    borderRadius: 1.5,
                    backgroundColor: 'primary.50',
                    border: '1px dashed',
                    borderColor: 'primary.300',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <EmailIcon fontSize="small" sx={{ color: 'primary.main' }} />
                  <Box>
                    <Typography variant="caption" fontWeight={600} color="primary.dark">
                      Auto Email Notification
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Email will be sent to <strong>{formData.email}</strong> when access is {isEditMode ? 'updated' : 'granted'}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>

          {/* Status Field (Edit Mode Only) */}
          {isEditMode && (
            <>
              <Divider sx={{ my: 1 }} />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleChange('status')}
                  label="Status"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="Active">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: 'success.main',
                        }}
                      />
                      Active
                    </Box>
                  </MenuItem>
                  <MenuItem value="Revoked">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: 'error.main',
                        }}
                      />
                      Revoked
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          {/* Info Alert */}
          {!isEditMode && (
            <Alert
              severity="info"
              icon={<InfoIcon />}
              sx={{ borderRadius: 2 }}
            >
              <Typography variant="body2">
                The user will be granted access to the selected product's feedback sheet.
              </Typography>
            </Alert>
          )}

          {/* Validation Summary */}
          {submitAttempted && validationErrors.length > 0 && (
            <Alert
              severity="error"
              sx={{ borderRadius: 2 }}
            >
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Please fix the following errors:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {validationErrors.map((error, index) => (
                  <li key={index}>
                    <Typography variant="caption">{error}</Typography>
                  </li>
                ))}
              </ul>
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            borderRadius: 2,
            px: 3,
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            borderRadius: 2,
            px: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)',
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : isEditMode ? (
            'Update User'
          ) : (
            'Add User'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormModal;
