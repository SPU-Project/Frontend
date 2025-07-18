import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // Import user slice
import profileReducer from "./profileSlice"; // Import profile slice
import bahanBakuReducer from "./bahanbakuslice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    profile: profileReducer,
    bahanBaku: bahanBakuReducer,
  },
});
