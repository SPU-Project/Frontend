import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk untuk menambahkan Bahan Baku
// Thunk untuk menambahkan Bahan Baku baru
export const addBahanBaku = createAsyncThunk(
  "bahanBaku/addBahanBaku",
  async ({ BahanBaku, Harga }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/bahanbaku", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ BahanBaku, Harga }),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message);
      }
      return data.data; // Return the newly added item
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk untuk mendapatkan semua Bahan Baku
export const fetchBahanBaku = createAsyncThunk(
  "bahanBaku/fetchBahanBaku",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/bahanbaku"); // Ubah sesuai dengan endpoint backend Anda
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message);
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk untuk menghapus Bahan Baku
export const deleteBahanBaku = createAsyncThunk(
  "bahanBaku/deleteBahanBaku",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/bahanbaku/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message);
      }
      return id; // Return the id of the deleted item
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk untuk mengupdate Bahan Baku
export const updateBahanBaku = createAsyncThunk(
  "bahanBaku/updateBahanBaku",
  async ({ id, BahanBaku, Harga }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/bahanbaku/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ BahanBaku, Harga }),
      });

      // Logging untuk melihat status dan isi dari respons
      console.log("Response status:", response.status);
      const contentType = response.headers.get("content-type");
      console.log("Response content-type:", contentType);

      // Cek apakah respons adalah JSON
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        if (!response.ok) {
          return rejectWithValue(data.message);
        }

        return data.data;
      } else {
        // Jika respons tidak berupa JSON, log responsnya
        const text = await response.text();
        console.error("Response is not JSON:", text);
        return rejectWithValue("Unexpected response format");
      }
    } catch (error) {
      // Tangani error di sisi frontend
      console.error("Error caught in updateBahanBaku:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const bahanBakuSlice = createSlice({
  name: "bahanBaku",
  initialState: {
    items: [],
    status: "idle",
    loading: false,
    error: null,
  },
  reducers: {
    // Reducers can go here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBahanBaku.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBahanBaku.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBahanBaku.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle delete Bahan Baku
      .addCase(deleteBahanBaku.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteBahanBaku.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteBahanBaku.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handle update Bahan Baku
      .addCase(updateBahanBaku.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateBahanBaku.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateBahanBaku.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default bahanBakuSlice.reducer;
