import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// بداية الحالة
const initialState = {
  sessions: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// ========== FETCH SESSIONS ==========
export const fetchSessions = createAsyncThunk(
  'teacher/fetchSessions',
  async (token, thunkAPI) => {
    try {
      const res = await axios.get('http://localhost:3001/teacher/sessions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.sessions;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// ========== CREATE SESSION ==========
export const createSession = createAsyncThunk(
  'teacher/createSession',
  async ({ token, sessionData }, thunkAPI) => {
    try {
      const res = await axios.post(
        'http://localhost:3001/teacher/create-session',
        sessionData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.session;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// ========== SLICE ==========
const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchSessions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sessions = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // CREATE
      .addCase(createSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sessions.push(action.payload);
      })
      .addCase(createSession.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export default teacherSlice.reducer;
