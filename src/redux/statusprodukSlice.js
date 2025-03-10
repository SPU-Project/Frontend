import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// 1. Fetch all
export const fetchStatusProduksi = createAsyncThunk(
  "statusproduksi/fetchStatusProduksi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/statusproduksi");
      return response.data.data; // array data
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

// 2. Create
export const createStatusProduksi = createAsyncThunk(
  "statusproduksi/createStatusProduksi",
  async (newData, { rejectWithValue }) => {
    try {
      const response = await api.post("/statusproduksi", newData);
      return response.data.data; // single object
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

// 3. Update (Patch)
export const updateStatusProduksi = createAsyncThunk(
  "statusproduksi/updateStatusProduksi",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/statusproduksi/${id}`, updatedData);
      return response.data.data; // single updated object
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

// 4. Delete
export const deleteStatusProduksi = createAsyncThunk(
  "statusproduksi/deleteStatusProduksi",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/statusproduksi/${id}`);
      return id; // Kembalikan ID yang dihapus
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

const statusproduksiSlice = createSlice({
  name: "statusproduksi",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetchStatusProduksi
    builder
      .addCase(fetchStatusProduksi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatusProduksi.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload; // array data
      })
      .addCase(fetchStatusProduksi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createStatusProduksi
      .addCase(createStatusProduksi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStatusProduksi.fulfilled, (state, action) => {
        state.loading = false;
        // add new item to array
        state.items.push(action.payload);
      })
      .addCase(createStatusProduksi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateStatusProduksi
      .addCase(updateStatusProduksi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStatusProduksi.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload = updated object
        const updatedItem = action.payload;
        // cari index
        const index = state.items.findIndex(
          (item) => item.id === updatedItem.id
        );
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
      })
      .addCase(updateStatusProduksi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteStatusProduksi
      .addCase(deleteStatusProduksi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStatusProduksi.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload = ID yang dihapus
        const deletedId = action.payload;
        state.items = state.items.filter((item) => item.id !== deletedId);
      })
      .addCase(deleteStatusProduksi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default statusproduksiSlice.reducer;
