import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk untuk mendapatkan gambar profil
export const fetchProfileImage = createAsyncThunk(
  "profile/fetchProfileImage",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://apiv2.pabrikbumbu.com/profile-image",
        {
          method: "GET",
          credentials: "include", // Sertakan cookie dalam permintaan jika diperlukan
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      return imageUrl; // Mengembalikan URL blob dari gambar yang diambil
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profileImage: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearProfileImage(state) {
      state.profileImage = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileImage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfileImage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profileImage = action.payload;
      })
      .addCase(fetchProfileImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearProfileImage } = profileSlice.actions;

export default profileSlice.reducer;
