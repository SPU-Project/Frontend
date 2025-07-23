import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const addProduk = createAsyncThunk(
  "produk/addProduk",
  async (produkData, { rejectWithValue }) => {
    try {
      const response = await fetch("https://apiv2.pabrikbumbu.com/produk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produkData),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Gagal menambahkan produk");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Gagal menambahkan produk");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "produk/updateProduct",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://apiv2.pabrikbumbu.com/produkbahanbaku/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Gagal memperbarui produk");
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Gagal memperbarui produk");
    }
  }
);

const produkSlice = createSlice({
  name: "produk",
  initialState: {
    product: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addProduk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduk.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(addProduk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Gagal menambahkan produk";
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Gagal memperbarui produk";
      });
  },
});

export default produkSlice.reducer;
