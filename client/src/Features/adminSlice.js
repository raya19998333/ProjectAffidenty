// Features/adminSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ===== ASYNC THUNKS =====

// 1️⃣ Get Admin Stats
export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found, login required');

      const res = await axios.get('http://localhost:3001/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 2️⃣ Get Recent Sessions
export const fetchRecentSessions = createAsyncThunk(
  'admin/fetchRecentSessions',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found, login required');

      const res = await axios.get(
        'http://localhost:3001/admin/recent-sessions',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 3️⃣ Get New Users
export const fetchNewUsers = createAsyncThunk(
  'admin/fetchNewUsers',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found, login required');

      const res = await axios.get('http://localhost:3001/admin/new-users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 4️⃣ Get Weekly Attendance
export const fetchWeeklyAttendance = createAsyncThunk(
  'admin/fetchWeeklyAttendance',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found, login required');

      const res = await axios.get(
        'http://localhost:3001/admin/attendance-weekly',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data; // array of { day, count }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchSystemNotes = createAsyncThunk(
  'admin/fetchSystemNotes',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/admin/system-notes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error');
    }
  }
);

// ===== SLICE =====
const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null,
    recentSessions: [],
    newUsers: [],
    weeklyAttendance: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Stats
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.loading = false;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Recent Sessions
    builder
      .addCase(fetchRecentSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentSessions.fulfilled, (state, action) => {
        state.recentSessions = action.payload;
        state.loading = false;
      })
      .addCase(fetchRecentSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // New Users
    builder
      .addCase(fetchNewUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewUsers.fulfilled, (state, action) => {
        state.newUsers = action.payload;
        state.loading = false;
      })
      .addCase(fetchNewUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Weekly Attendance
    builder
      .addCase(fetchWeeklyAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeeklyAttendance.fulfilled, (state, action) => {
        state.weeklyAttendance = action.payload;
        state.loading = false;
      })
      .addCase(fetchWeeklyAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
