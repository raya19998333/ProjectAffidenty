// src/features/attendanceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// GET Attendance History
export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async (token, thunkAPI) => {
    try {
      const res = await axios.get('http://localhost:3001/student/history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.history;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Confirm Attendance
export const confirmAttendance = createAsyncThunk(
  'attendance/confirmAttendance',
  async ({ token, code }, thunkAPI) => {
    try {
      const res = await axios.post(
        'http://localhost:3001/student/attend',
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.attendance;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    history: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH HISTORY
      .addCase(fetchAttendance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.history = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // CONFIRM ATTENDANCE
      .addCase(confirmAttendance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(confirmAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.history.push({
          subject: `Session ${action.payload.sessionId}`,
          time: '—',
          room: '—',
          date: new Date().toISOString().split('T')[0],
          status: 'Present',
        });
      })
      .addCase(confirmAttendance.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default attendanceSlice.reducer;
