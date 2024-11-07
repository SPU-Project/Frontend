// src/redux/riwayatSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios"; // Adjust the path as necessary

// Thunk to fetch all riwayat logs
export const fetchRiwayat = createAsyncThunk(
  "riwayat/fetchRiwayat",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/riwayat");
      return response.data.data; // Assuming logs are in response.data.data
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const riwayatSlice = createSlice({
  name: "riwayat",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Add any reducers if necessary
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRiwayat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRiwayat.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRiwayat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default riwayatSlice.reducer;
