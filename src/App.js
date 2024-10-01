import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RawMaterialsPage from "./pages/RawMaterialsPage";
import ProductsPage from "./pages/ProductsPage";
import TotalCostProductPage from "./pages/TotalCostProductPage";
import ProductFormPage from "./pages/ProductFormPage";
import LoginPage from "./pages/LoginPage";
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
        <Route path="/form/:productId" element={<ProductFormPage />} />{" "}
        {/* Tambahkan route ini */}
        <Route
          path="/total-cost"
          element={
            <TotalCostProductPage
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
          }
        />
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
