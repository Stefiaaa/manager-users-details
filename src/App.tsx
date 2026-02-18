import React, { useEffect, useState, useCallback } from 'react';
import { ThemeProvider, CssBaseline, Container, Box, CircularProgress } from '@mui/material';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  fetchUsers,
  fetchProducts,
  fetchSlackChannels,
  addUser,
  updateUser,
  revokeUser,
} from './store/userSlice';
import theme from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
// import FeedbackFormPage from './components/FeedbackFormPage';  // feedback form – commented out
import FilterBar from './components/FilterBar';
import UserTable from './components/UserTable';
import UserFormModal from './components/UserFormModal';
import RevokeConfirmDialog from './components/RevokeConfirmDialog';
import { User, UserFormData, TableFilters, PaginationState, UserOperationResult } from './types';
// import { createFormAccessSession } from './utils/feedbackFormAccess';  // feedback form – commented out

// Loading screen component
const LoadingScreen: React.FC = () => (
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

// Main dashboard content
const DashboardContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, products, slackChannels, loading } = useAppSelector((state) => state.users);
  const { enqueueSnackbar } = useSnackbar();

  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // State for filters and pagination
  const [filters, setFilters] = useState<TableFilters>({
    search: '',
    product: '',
    status: '',
  });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    rowsPerPage: 10,
  });

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchProducts());
    dispatch(fetchSlackChannels());
  }, [dispatch]);

  // Handlers
  const handleAddUser = useCallback(() => {
    setSelectedUser(null);
    setIsFormModalOpen(true);
  }, []);

  const handleEditUser = useCallback((user: User) => {
    setSelectedUser(user);
    setIsFormModalOpen(true);
  }, []);

  const handleRevokeUser = useCallback((user: User) => {
    setSelectedUser(user);
    setIsRevokeDialogOpen(true);
  }, []);

  const handleCloseFormModal = useCallback(() => {
    setIsFormModalOpen(false);
    setSelectedUser(null);
  }, []);

  const handleCloseRevokeDialog = useCallback(() => {
    setIsRevokeDialogOpen(false);
    setSelectedUser(null);
  }, []);

  // Helper function to build Slack channel operation message
  const buildSlackChannelMessage = (result: UserOperationResult): string | null => {
    const op = result.slackChannelOperation;
    if (!op) return null;

    if (op.channelChangeFrom && op.channelChangeTo) {
      return `User moved from ${op.channelChangeFrom} to ${op.channelChangeTo}`;
    }
    if (op.addedToChannel) {
      return `User added to Slack channel ${op.addedToChannel}`;
    }
    if (op.removedFromChannel) {
      return `User removed from Slack channel ${op.removedFromChannel}`;
    }
    return null;
  };

  const handleFormSubmit = async (formData: UserFormData) => {
    try {
      if (selectedUser) {
        const result = await dispatch(updateUser({ id: selectedUser.id, userData: formData })).unwrap();
        handleCloseFormModal();
        
        // Show success message
        enqueueSnackbar('User updated successfully!', {
          variant: 'success',
          autoHideDuration: 4000,
        });

        // Show Slack channel operation notification if applicable
        const slackMessage = buildSlackChannelMessage(result);
        if (slackMessage) {
          enqueueSnackbar(slackMessage, {
            variant: 'info',
            autoHideDuration: 5000,
          });
        }
      } else {
        const result = await dispatch(addUser(formData)).unwrap();
        handleCloseFormModal();
        
        // Show success message
        enqueueSnackbar('User added successfully!', {
          variant: 'success',
          autoHideDuration: 4000,
        });

        // Show Slack channel operation notification if applicable
        const slackMessage = buildSlackChannelMessage(result);
        if (slackMessage) {
          enqueueSnackbar(slackMessage, {
            variant: 'info',
            autoHideDuration: 5000,
          });
        }
      }
    } catch (error: any) {
      enqueueSnackbar(error || 'An error occurred. Please try again.', {
        variant: 'error',
        autoHideDuration: 5000,
      });
      throw error;
    }
  };

  const handleRevokeConfirm = async () => {
    if (!selectedUser) return;

    try {
      await dispatch(revokeUser(selectedUser.id)).unwrap();
      handleCloseRevokeDialog();
      enqueueSnackbar('User access revoked successfully!', {
        variant: 'warning',
        autoHideDuration: 4000,
      });
    } catch (error: any) {
      enqueueSnackbar(error || 'Failed to revoke access. Please try again.', {
        variant: 'error',
        autoHideDuration: 5000,
      });
    }
  };

  const handleFilterChange = useCallback((newFilters: TableFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 0 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const handleRowsPerPageChange = useCallback((rowsPerPage: number) => {
    setPagination({ page: 0, rowsPerPage });
  }, []);

  // Feedback form – commented out
  // const handleOpenFeedbackForm = useCallback(() => {
  //   const token = createFormAccessSession();
  //   window.location.assign(`/feedback-form?token=${encodeURIComponent(token)}`);
  // }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f0f4f8 0%, #e2e8f0 100%)',
      }}
    >
      <Header />

      <Container maxWidth="xl" sx={{ pb: 6 }}>
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onAddUser={handleAddUser}
          products={products}
        />

        <UserTable
          users={users}
          loading={loading}
          filters={filters}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onEdit={handleEditUser}
          onRevoke={handleRevokeUser}
        />
      </Container>

      <UserFormModal
        open={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleFormSubmit}
        user={selectedUser}
        products={products}
        slackChannels={slackChannels}
        loading={loading}
        existingEmails={users.map((u) => u.email)}
      />

      <RevokeConfirmDialog
        open={isRevokeDialogOpen}
        onClose={handleCloseRevokeDialog}
        onConfirm={handleRevokeConfirm}
        user={selectedUser}
        loading={loading}
      />
    </Box>
  );
};

// App content with authentication check
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  // Feedback form route – commented out
  // const isFeedbackRoute = window.location.pathname.startsWith('/feedback-form');

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // if (isFeedbackRoute) {
  //   return <FeedbackFormPage />;
  // }

  return <DashboardContent />;
};

// Main App component
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          autoHideDuration={4000}
        >
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
