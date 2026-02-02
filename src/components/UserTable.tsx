import React, { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  Box,
  Typography,
  Skeleton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Schedule as PendingIcon,
  DoNotDisturb as NotSentIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { User, TableFilters, PaginationState, NotificationStatus } from '../types';

interface UserTableProps {
  users: User[];
  loading: boolean;
  filters: TableFilters;
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onEdit: (user: User) => void;
  onRevoke: (user: User) => void;
}

const TABLE_COLUMNS = [
  { header: 'Product', shortHeader: 'Product', width: '12%', minWidth: 100 },
  { header: 'Name', shortHeader: 'Name', width: '10%', minWidth: 80 },
  { header: 'Email', shortHeader: 'Email', width: '14%', minWidth: 120 },
  { header: 'Stakeholder Sheet Access', shortHeader: 'Stakeholder Sheet', width: '10%', minWidth: 80 },
  { header: 'Slack Channel', shortHeader: 'Slack Channel', width: '12%', minWidth: 100 },
  { header: 'Sheet Status', shortHeader: 'Sheet Status', width: '7%', minWidth: 60 },
  { header: 'Slack Notification', shortHeader: 'Slack Notif.', width: '8%', minWidth: 70 },
  { header: 'Gmail Notification', shortHeader: 'Gmail Notif.', width: '8%', minWidth: 70 },
  { header: 'Created At', shortHeader: 'Created', width: '9%', minWidth: 80 },
  { header: 'Actions', shortHeader: 'Actions', width: '7%', minWidth: 70 },
];

// Notification status chip component
const NotificationStatusChip: React.FC<{ status: NotificationStatus; type: 'slack' | 'gmail' }> = ({ status, type }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'Sent':
        return {
          icon: <CheckIcon fontSize="inherit" />,
          color: 'success' as const,
          bgColor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          label: 'Sent',
        };
      case 'Failed':
        return {
          icon: <ErrorIcon fontSize="inherit" />,
          color: 'error' as const,
          bgColor: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          label: 'Failed',
        };
      case 'Pending':
        return {
          icon: <PendingIcon fontSize="inherit" />,
          color: 'warning' as const,
          bgColor: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          label: 'Pending',
        };
      case 'Not Sent':
      default:
        return {
          icon: <NotSentIcon fontSize="inherit" />,
          color: 'default' as const,
          bgColor: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
          label: 'N/A',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Tooltip title={`${type === 'slack' ? 'Slack' : 'Gmail'}: ${status}`}>
      <Chip
        icon={config.icon}
        label={config.label}
        size="small"
        sx={{
          fontWeight: 500,
          fontSize: '0.75rem',
          height: 26,
          background: config.bgColor,
          color: 'white',
          '& .MuiChip-icon': {
            color: 'white',
            fontSize: '1rem',
          },
        }}
      />
    </Tooltip>
  );
};

const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  filters,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onRevoke,
}) => {
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        !filters.search ||
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower);
      const matchesProduct = !filters.product || user.product === filters.product;
      const matchesStatus = !filters.status || user.status === filters.status;
      return matchesSearch && matchesProduct && matchesStatus;
    });
  }, [users, filters]);

  const paginatedUsers = useMemo(() => {
    const start = pagination.page * pagination.rowsPerPage;
    return filteredUsers.slice(start, start + pagination.rowsPerPage);
  }, [filteredUsers, pagination]);

  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  if (loading) {
    return (
      <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.dark' }}>
              {TABLE_COLUMNS.map((col) => (
                <Tooltip key={col.header} title={col.header} arrow placement="top">
                  <TableCell 
                    sx={{ 
                      color: 'white', 
                      fontWeight: 600,
                      width: col.width,
                      minWidth: col.minWidth,
                      cursor: 'help',
                    }}
                  >
                    {col.shortHeader}
                  </TableCell>
                </Tooltip>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                {[...Array(TABLE_COLUMNS.length)].map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton animation="wave" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <Paper
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No users found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {filters.search || filters.product || filters.status
            ? 'Try adjusting your search or filter criteria'
            : 'Add your first user to get started'}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ tableLayout: 'fixed', minWidth: 1000 }}>
          <TableHead>
            <TableRow
              sx={{
                background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
              }}
            >
              {TABLE_COLUMNS.map((col) => (
                <Tooltip key={col.header} title={col.header} arrow placement="top">
                  <TableCell
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      letterSpacing: '0.3px',
                      py: 1.5,
                      px: 1.5,
                      whiteSpace: 'nowrap',
                      width: col.width,
                      minWidth: col.minWidth,
                      cursor: 'help',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {col.shortHeader}
                  </TableCell>
                </Tooltip>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? 'background.paper' : 'action.hover',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    transform: 'scale(1.002)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  },
                }}
              >
                {/* Product - First */}
                <TableCell sx={{ px: 1.5 }}>
                  <Tooltip title={user.product}>
                    <Chip
                      label={user.product}
                      size="small"
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        height: 26,
                        maxWidth: '100%',
                        '& .MuiChip-label': {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          px: 1,
                        },
                      }}
                    />
                  </Tooltip>
                </TableCell>
                {/* Name */}
                <TableCell sx={{ fontWeight: 600, fontSize: '0.9rem', px: 1.5, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <Tooltip title={user.name}>
                    <span>{user.name}</span>
                  </Tooltip>
                </TableCell>
                {/* Email */}
                <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem', px: 1.5, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <Tooltip title={user.email}>
                    <span>{user.email}</span>
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ px: 1.5 }}>
                  <Chip
                    label={user.stakeholderAccessLevel || 'None'}
                    size="small"
                    color={
                      user.stakeholderAccessLevel === 'Edit' 
                        ? 'warning' 
                        : user.stakeholderAccessLevel === 'View' 
                          ? 'info' 
                          : 'default'
                    }
                    variant="outlined"
                    sx={{ fontWeight: 500, fontSize: '0.8rem', height: 26 }}
                  />
                </TableCell>
                <TableCell sx={{ px: 1.5 }}>
                  <Tooltip title={user.slackChannel || 'Not set'}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: user.slackChannel ? 'secondary.main' : 'text.disabled',
                        fontFamily: 'monospace',
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {user.slackChannel || '-'}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ px: 1.5 }}>
                  <Chip
                    label={user.status}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      height: 26,
                      ...(user.status === 'Active'
                        ? {
                            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                            color: 'white',
                          }
                        : {
                            background: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
                            color: 'white',
                          }),
                    }}
                  />
                </TableCell>
                <TableCell sx={{ px: 1.5 }}>
                  <NotificationStatusChip 
                    status={user.slackNotificationStatus || 'Not Sent'} 
                    type="slack" 
                  />
                </TableCell>
                <TableCell sx={{ px: 1.5 }}>
                  <NotificationStatusChip 
                    status={user.gmailNotificationStatus || 'Not Sent'} 
                    type="gmail" 
                  />
                </TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem', px: 1.5, whiteSpace: 'nowrap' }}>
                  {dayjs(user.createdAt).format('MMM DD, YY')}
                </TableCell>
                <TableCell sx={{ px: 1.5 }}>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit user">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(user)}
                        sx={{
                          color: 'primary.main',
                          '&:hover': {
                            backgroundColor: 'primary.light',
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {user.status === 'Active' && (
                      <Tooltip title="Revoke access">
                        <IconButton
                          size="small"
                          onClick={() => onRevoke(user)}
                          sx={{
                            color: 'error.main',
                            '&:hover': {
                              backgroundColor: 'error.light',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <BlockIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={pagination.rowsPerPage}
        page={pagination.page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            fontWeight: 500,
          },
        }}
      />
    </Paper>
  );
};

export default UserTable;
