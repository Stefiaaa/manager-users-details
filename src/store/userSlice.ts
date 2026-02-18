import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserFormData, UsersState, UserOperationResult } from '../types';
import { userService, productService, slackChannelService } from '../services/api';
import { getFallbackSlackChannels } from '../config/slackChannelConfig';
import { 
  addUserToProductChannel, 
  removeUserFromProductChannel
} from '../services/slackService';

const initialState: UsersState = {
  users: [],
  products: [],
  slackChannels: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchUsers = createAsyncThunk('users/fetchAll', async () => {
  const users = await userService.getAll();
  return users;
});

export const fetchProducts = createAsyncThunk('users/fetchProducts', async () => {
  const products = await productService.getAll();
  return products;
});

export const fetchSlackChannels = createAsyncThunk('users/fetchSlackChannels', async () => {
  try {
    const channels = await slackChannelService.getAll();
    return channels?.length ? channels : getFallbackSlackChannels();
  } catch {
    return getFallbackSlackChannels();
  }
});

export const addUser = createAsyncThunk(
  'users/add',
  async (userData: UserFormData, { rejectWithValue }) => {
    try {
      const result = await userService.create(userData);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/update',
  async (
    { id, userData }: { id: string; userData: Partial<UserFormData> },
    { rejectWithValue }
  ) => {
    try {
      const result = await userService.update(id, userData);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update user');
    }
  }
);

export const revokeUser = createAsyncThunk(
  'users/revoke',
  async (id: string, { rejectWithValue }) => {
    try {
      const revokedUser = await userService.revoke(id);
      return revokedUser;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to revoke user');
    }
  }
);

export const retryNotification = createAsyncThunk(
  'users/retryNotification',
  async ({ id, type }: { id: string; type: 'slack' | 'gmail' }, { rejectWithValue }) => {
    try {
      const updatedUser = await userService.retryNotification(id, type);
      return updatedUser;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to retry notification');
    }
  }
);

// Async thunk for adding user to Slack channel based on product
export const addUserToSlackChannel = createAsyncThunk(
  'users/addToSlackChannel',
  async (
    { userEmail, userName, product }: { userEmail: string; userName: string; product: string },
    { rejectWithValue }
  ) => {
    try {
      const result = await addUserToProductChannel(userEmail, userName, product);
      if (!result.success) {
        return rejectWithValue(result.error || 'Failed to add user to Slack channel');
      }
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add user to Slack channel');
    }
  }
);

// Async thunk for removing user from Slack channel based on product
export const removeUserFromSlackChannel = createAsyncThunk(
  'users/removeFromSlackChannel',
  async (
    { userEmail, userName, product }: { userEmail: string; userName: string; product: string },
    { rejectWithValue }
  ) => {
    try {
      const result = await removeUserFromProductChannel(userEmail, userName, product);
      if (!result.success) {
        return rejectWithValue(result.error || 'Failed to remove user from Slack channel');
      }
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove user from Slack channel');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      // Fetch products
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      // Fetch slack channels
      .addCase(fetchSlackChannels.fulfilled, (state, action) => {
        state.slackChannels = action.payload;
      })
      .addCase(fetchSlackChannels.rejected, (state) => {
        state.slackChannels = getFallbackSlackChannels();
      })
      // Add user
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<UserOperationResult>) => {
        state.loading = false;
        state.users.push(action.payload.user);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<UserOperationResult>) => {
        state.loading = false;
        const index = state.users.findIndex((u) => u.id === action.payload.user.id);
        if (index !== -1) {
          state.users[index] = action.payload.user;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Revoke user
      .addCase(revokeUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(revokeUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(revokeUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Retry notification
      .addCase(retryNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(retryNotification.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(retryNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add user to Slack channel
      .addCase(addUserToSlackChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUserToSlackChannel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addUserToSlackChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Remove user from Slack channel
      .addCase(removeUserFromSlackChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeUserFromSlackChannel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeUserFromSlackChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
