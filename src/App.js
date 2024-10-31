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
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/raw-materials"
          element={
            <RawMaterialsPage
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
          }
        />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/form" element={<ProductFormPage />} />
        <Route path="/status-product" element={<StatusProductPage />} />
        <Route path="/form-status" element={<FormStatusProductPage />} />
        <Route path="/form/:id" element={<ProductFormPage />} />
        <Route path="/total-cost" element={<TotalCostProductPage />} />
        <Route path="/total-cost/:id" element={<TotalCostProductPage />} />
        <Route path="/user-management" element={<UserManagementPage />} />
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
