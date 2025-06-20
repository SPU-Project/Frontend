import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials, { dispatch, getState }) => {
    console.log("LoginUser Thunk Triggered"); // Log untuk melihat kapan thunk dipanggil
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || "Failed to log in.");
    }

    return { user: data.user, userId: data.uuid };
  }
);

// Define async thunks for API calls
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { getState }) => {
    const response = await fetch("http://localhost:5000/me", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }

    const data = await response.json();
    return data.user;
  }
);

export const logoutUser = createAsyncThunk("user/logoutUser", async () => {
  const response = await fetch("http://localhost:5000/logout", {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.msg || "Failed to log out.");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    userId: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.userId = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.userId = action.payload.uuid;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.userId = action.payload.userId;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.user = null;
        state.userId = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;
