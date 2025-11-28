import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  user: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
};
// REGISTER
export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (data, thunkAPI) => {
    try {
      // غير endpoint هنا ليطابق السيرفر
      const res = await axios.post("http://localhost:3001/registerUser", data);
      return res.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


// LOGIN
export const loginUser = createAsyncThunk(
  'users/loginUser',
  async (data, thunkAPI) => {
    try {
      const res = await axios.post('http://localhost:3001/login', data);
      return {
        token: res.data.token,
        role: res.data.role,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue('Invalid credentials');
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk("users/logoutUser", async () => {
  await axios.post("http://localhost:3001/api/logout");
  return null;
});
// UPDATE PROFILE
export const updateUserProfile = createAsyncThunk(
  "users/updateUserProfile",
  async (data, thunkAPI) => {
    try {
      const res = await axios.put(
        `http://localhost:3001/api/updateProfile/${data.email}`,
        data
      );
      return res.data.user;
    } catch (e) {
      return thunkAPI.rejectWithValue("Update failed");
    }
  }
);
// SLICE
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = {
          role: action.payload.role,
          token: action.payload.token,
        };
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isSuccess = false;
        state.isLoading = false;
      })
      // UPDATE PROFILE
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});
export default userSlice.reducer;
