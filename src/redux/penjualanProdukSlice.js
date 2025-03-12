import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios"; // Pastikan path ke axios benar

// GET all penjualan-produk
export const fetchPenjualanProduks = createAsyncThunk(
  "penjualanproduk/fetchPenjualanProduks",
  async (_, { rejectWithValue }) => {
    try {
      // Endpoint: GET /PenjualanProduk
      const response = await api.get("/PenjualanProduk");
      // Respons { message, data: [...]}
      return response.data.data; // array data
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

// GET by id penjualan-produk
export const fetchPenjualanProdukById = createAsyncThunk(
  "penjualanproduk/fetchPenjualanProdukById",
  async (id, { rejectWithValue }) => {
    try {
      // GET /PenjualanProduk/:id
      const response = await api.get(`/PenjualanProduk/${id}`);
      return response.data.data; // single item
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

// CREATE penjualan-produk
// Body minimal: { NamaProduk, Batch, Margin, (Terjual optional) }
export const createPenjualanProduk = createAsyncThunk(
  "penjualanproduk/createPenjualanProduk",
  async (newData, { rejectWithValue }) => {
    try {
      // POST /PenjualanProduk
      const response = await api.post("/PenjualanProduk", newData);
      return response.data.data; // single created item
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

// UPDATE penjualan-produk
// Body: { NamaProduk, Batch, Margin, (Terjual optional) }
export const updatePenjualanProduk = createAsyncThunk(
  "penjualanproduk/updatePenjualanProduk",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      // PATCH /PenjualanProduk/:id
      const response = await api.patch(`/PenjualanProduk/${id}`, updatedData);
      return response.data.data; // single updated item
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

// DELETE penjualan-produk
export const deletePenjualanProduk = createAsyncThunk(
  "penjualanproduk/deletePenjualanProduk",
  async (id, { rejectWithValue }) => {
    try {
      // DELETE /PenjualanProduk/:id
      const response = await api.delete(`/PenjualanProduk/${id}`);
      // jika berhasil, kembalikan id agar di front end bisa dihapus
      return id;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

const penjualanProdukSlice = createSlice({
  name: "penjualanproduk",
  initialState: {
    items: [], // array penjualan produk
    currentItem: null, // kalau butuh detail by id
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetchPenjualanProduks
    builder
      .addCase(fetchPenjualanProduks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPenjualanProduks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload; // array data
      })
      .addCase(fetchPenjualanProduks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchPenjualanProdukById
      .addCase(fetchPenjualanProdukById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPenjualanProdukById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload; // single object
      })
      .addCase(fetchPenjualanProdukById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createPenjualanProduk
      .addCase(createPenjualanProduk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPenjualanProduk.fulfilled, (state, action) => {
        state.loading = false;
        // push ke items
        state.items.push(action.payload);
      })
      .addCase(createPenjualanProduk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updatePenjualanProduk
      .addCase(updatePenjualanProduk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePenjualanProduk.fulfilled, (state, action) => {
        state.loading = false;
        const updatedItem = action.payload;
        // replace item di state.items
        const index = state.items.findIndex((i) => i.id === updatedItem.id);
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
      })
      .addCase(updatePenjualanProduk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deletePenjualanProduk
      .addCase(deletePenjualanProduk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePenjualanProduk.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        state.items = state.items.filter((item) => item.id !== deletedId);
      })
      .addCase(deletePenjualanProduk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default penjualanProdukSlice.reducer;
