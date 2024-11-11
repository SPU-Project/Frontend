import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RawMaterialsPage from "./pages/RawMaterialsPage";
import ProductsPage from "./pages/ProductsPage";
import TotalCostProductPage from "./pages/TotalCostProductPage";
import ProductFormPage from "./pages/ProductFormPage";
import LoginPage from "./pages/LoginPage";
import FormStatusProductPage from "./pages/FormStatusProductPage";
import StatusProductPage from "./pages/StatusProductPage";
import UserManagementPage from "./pages/UserManagementPage";
import UserManagementFormPage from "./pages/UserManagementFormPage";
import StockRawMaterialPage from "./pages/StockRawMaterialPage";
import LogHistoryPage from "./pages/LogHistoryPage";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ProtectedRoute from "./components/ProtectedRoute";

//SPU_Tugas-Akhir_Local
function App() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/raw-materials"
          element={
            <ProtectedRoute>
              <RawMaterialsPage
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/form"
          element={
            <ProtectedRoute>
              <ProductFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/status-product"
          element={
            <ProtectedRoute>
              <StatusProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/form-status"
          element={
            <ProtectedRoute>
              <FormStatusProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/form/:id"
          element={
            <ProtectedRoute>
              <ProductFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/total-cost"
          element={
            <ProtectedRoute>
              <TotalCostProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/total-cost/:id"
          element={
            <ProtectedRoute>
              <TotalCostProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <ProtectedRoute>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/log-history"
          element={
            <ProtectedRoute>
              <LogHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-management-form"
          element={<UserManagementFormPage />}
        />
        {/* Add the route for editing users */}

        <Route
          path="/user-management-form/:id"
          element={
            <ProtectedRoute>
              <UserManagementFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock-raw-materials"
          element={
            <ProtectedRoute>
              <StockRawMaterialPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
