import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk untuk mengambil data produk
export const fetchProducts = createAsyncThunk(
  "productTable/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/produkdetails");
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Gagal mengambil data produk");
      }
      return data.data; // Mengembalikan data produk
    } catch (error) {
      return rejectWithValue(error.message || "Gagal mengambil data produk");
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "productTable/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/produkdetails/${id}`);
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Gagal mengambil data produk");
      }
      return data.data[0]; // Mengambil item pertama dari array data
    } catch (error) {
      return rejectWithValue(error.message || "Gagal mengambil data produk");
    }
  }
);

// Async thunk untuk menghapus produk
export const deleteProduct = createAsyncThunk(
  "productTable/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/produkdelete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Gagal menghapus produk");
      }
      return id; // Mengembalikan id produk yang dihapus
    } catch (error) {
      return rejectWithValue(error.message || "Gagal menghapus produk");
    }
  }
);

// Async thunk untuk mengupdate produk
export const updateProduct = createAsyncThunk(
  "productTable/updateProduct",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:5000/produkbahanbaku/${id}`,
        {
          method: "PUT",
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
      return data.data; // Mengembalikan data produk yang diperbarui
    } catch (error) {
      return rejectWithValue(error.message || "Gagal memperbarui produk");
    }
  }
);

const productTableSlice = createSlice({
  name: "productTable",
  initialState: {
    products: [],
    currentProduct: null, // Add this to store the currently fetched product
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add cases for fetchProductById
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete product
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update product
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.map((product) =>
          product.produkId === action.payload.id
            ? { ...product, produk: action.payload }
            : product
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productTableSlice.reducer;
