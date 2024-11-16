// src/redux/stokbahanbakuSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  stockItems: [],
  status: "idle",
  error: null,
};

// Async thunk for fetching all stock items
export const fetchStockItems = createAsyncThunk(
  "stokbahanbaku/fetchStockItems",
  async () => {
    const response = await fetch(
      "https://apiv2.pabrikbumbu.com/stokbahanbaku",
      {
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch stock items");
    }
    const data = await response.json();
    return data.data; // Assuming the data is in data.data
  }
);

// Async thunk for updating a stock item
export const updateStockItem = createAsyncThunk(
  "stokbahanbaku/updateStockItem",
  async ({ id, Stok }) => {
    const response = await fetch(
      `https://apiv2.pabrikbumbu.com/stokbahanbaku/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Stok }),
      }
    );
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to update stock item");
    }
    const data = await response.json();
    return data.data; // Assuming the updated stock item is in data.data
  }
);

const stokbahanbakuSlice = createSlice({
  name: "stokbahanbaku",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStockItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stockItems = action.payload;
      })
      .addCase(fetchStockItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateStockItem.fulfilled, (state, action) => {
        // Update the specific stock item in the state
        const updatedItem = action.payload;
        const index = state.stockItems.findIndex(
          (item) => item.id === updatedItem.id
        );
        if (index !== -1) {
          state.stockItems[index] = updatedItem;
        }
      })
      .addCase(updateStockItem.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default stokbahanbakuSlice.reducer;
