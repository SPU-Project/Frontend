import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // Import user slice
import bahanBakuReducer from "./bahanbakuslice";
import produkReducer from "./produkSlice";
import productTableReducer from "./productTableSlice";
import userManagementReducer from "./userManagementSlice";
import riwayatReducer from "./riwayatSlice"; // Import product
import stokbahanbakuReducer from "./stokbahanbakuSlice";
import statusprodukReducer from "./statusprodukSlice"; // Import status producer
import penjualanProdukReducer from "./penjualanProdukSlice";
import imageReducer from "./imageSlice"; // Import imageSlice

export const store = configureStore({
  reducer: {
    user: userReducer,
    bahanBaku: bahanBakuReducer,
    produk: produkReducer,
    productTable: productTableReducer,
    userManagement: userManagementReducer,
    riwayat: riwayatReducer,
    stokbahanbaku: stokbahanbakuReducer,
    statusproduksi: statusprodukReducer,
    penjualanproduk: penjualanProdukReducer,
    image: imageReducer,
  },
});
