import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllUser,
  getUserById,
  getPaginatedUser,
  searchUser as apiSearchUser,
  login,
  createUser as apiCreateUser,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
} from "../../utils/Api/userApi";

const saveToLocalStorage = (key, value) => localStorage.setItem(key, value);
const removeFromLocalStorage = (key) => localStorage.removeItem(key);

// Thunks cho các hành động bất đồng bộ
export const fetchAllUsers = createAsyncThunk("user/fetchAll", async () => {
  const data = await getAllUser();
  return data;
});

export const fetchUserById = createAsyncThunk("user/fetchById", async (id) => {
  const data = await getUserById(id);
  return data;
});

export const fetchPaginatedUsers = createAsyncThunk(
  "user/fetchPaginated",
  async ({ page, size }) => {
    const data = await getPaginatedUser(page, size);
    return data;
  }
);

export const searchUser = createAsyncThunk(
  "user/search",
  async (criteria) => {
    const data = await apiSearchUser(criteria);
    return data;
  }
);

export const createUser = createAsyncThunk("user/create", async (formData) => {
  const data = await apiCreateUser(formData);
  return data;
});

export const updateUser = createAsyncThunk("user/update", async ({ id, formData }) => {
  const data = await apiUpdateUser(id, formData);
  return data;
});

export const deleteUser = createAsyncThunk("user/delete", async (id) => {
  await apiDeleteUser(id);
  return id;
});

export const loginUser = createAsyncThunk(
  "users/loginUser",
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await login(username, password); // Gọi API
      const { token, userId, username: responseUsername, roles } = response; // Lấy dữ liệu từ phản hồi

      // Lưu thông tin vào localStorage
      saveToLocalStorage("token", token);
      saveToLocalStorage("username", responseUsername);
      saveToLocalStorage("userId", userId);
      saveToLocalStorage("roles", roles);
      localStorage.setItem('isLoggedIn', 'true');
      return { token, userId, username: responseUsername, roles }; // Trả dữ liệu
    } catch (error) {
      const errorMessage = error.response?.data || error.message || "Failed to log in";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    currentUser: null,
    paginatedUsers: {
      content: [],
      page: 0,
      size: 5,
      totalElements: 0,
      totalPages: 0,
    },
    status: "idle", // idle | loading | succeeded | failed
    error: null,
    searchResults: [],
  },
  reducers: {
    logoutUser: (state) => {
      state.currentUser = null; // Xóa thông tin người dùng hiện tại
      removeFromLocalStorage('token');
      removeFromLocalStorage('username');
      removeFromLocalStorage('userId');
      removeFromLocalStorage('user');
      localStorage.setItem('isLoggedIn', 'false');
      
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Fetch User By ID
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })
      // Fetch Paginated Users
      .addCase(fetchPaginatedUsers.fulfilled, (state, action) => {
        state.paginatedUsers = action.payload;
      })
      .addCase(searchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.searchResults = action.payload;
      })
      .addCase(searchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Create User
      .addCase(createUser.fulfilled, (state, action) => {
        // state.currentUser = action.payload;
        state.users.push(action.payload);
      })
      // Update User
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      // Xử lý loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload; // Lưu thông tin user trả về từ API
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to log in";
      });
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
