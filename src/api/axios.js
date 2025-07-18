// src/api/axios.js (path ini bisa disesuaikan dengan struktur proyek Anda)
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // Sesuaikan dengan URL backend Anda
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
