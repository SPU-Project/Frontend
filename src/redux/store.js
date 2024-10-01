import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // Import user slice
import profileReducer from "./profileSlice"; // Import profile slice
import bahanBakuReducer from "./bahanbakuslice";
import produkReducer from "./produkSlice";
import productTableReducer from "./productTableSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    profile: profileReducer,
    bahanBaku: bahanBakuReducer,
    produk: produkReducer,
    productTable: productTableReducer,
  },
});
