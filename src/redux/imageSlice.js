// src/redux/imageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const uploadImage = createAsyncThunk(
  "image/uploadImage",
  async (file, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      // Gunakan URL absolut jika tidak memakai proxy
      const response = await fetch("http://localhost:5000/upload-profile", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return data;
      } else {
        const errorText = await response.text();
        return thunkAPI.rejectWithValue(`Server error: ${errorText}`);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchImage = createAsyncThunk(
  "image/fetchImage",
  async (_, thunkAPI) => {
    try {
      // Gunakan URL absolut jika tidak memakai proxy
      const response = await fetch("http://localhost:5000/profile-image", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        return thunkAPI.rejectWithValue("Gagal mengambil gambar profil");
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      return imageUrl;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const imageSlice = createSlice({
  name: "image",
  initialState: {
    uploadStatus: "idle", // idle | loading | succeeded | failed
    uploadError: null,
    fetchStatus: "idle",
    fetchError: null,
    image: null,
    uploadedImagePath: null,
  },
  reducers: {
    clearImageState: (state) => {
      state.uploadStatus = "idle";
      state.uploadError = null;
      state.fetchStatus = "idle";
      state.fetchError = null;
      state.image = null;
      state.uploadedImagePath = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload image
      .addCase(uploadImage.pending, (state) => {
        state.uploadStatus = "loading";
        state.uploadError = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.uploadStatus = "succeeded";
        state.uploadedImagePath = action.payload.profileImage;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.uploadStatus = "failed";
        state.uploadError = action.payload || action.error.message;
      })
      // Fetch image
      .addCase(fetchImage.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchImage.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.image = action.payload;
      })
      .addCase(fetchImage.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError = action.payload || action.error.message;
      });
  },
});

export const { clearImageState } = imageSlice.actions;
export default imageSlice.reducer;
