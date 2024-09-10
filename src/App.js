import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RawMaterialsPage from './pages/RawMaterialsPage'; // Pastikan path benar
import ProductsPage from './pages/ProductsPage'; // Pastikan path benar
import TotalCostProductPage from './pages/TotalCostProductPage'; // Pastikan path benar
import ProductFormPage from './pages/ProductFormPage'; // Pastikan path benar
import LoginPage from './pages/LoginPage'; // Import halaman Login
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<LoginPage />} // Set default route ke halaman Login
        />
        <Route
          path="/raw-materials"
          element={<RawMaterialsPage searchTerm={searchTerm} onSearchChange={handleSearchChange} />}
        />
        <Route
          path="/products"
          element={<ProductsPage />}
        />
        <Route path="/form" element={<ProductFormPage />} />
        <Route
          path="/total-cost"
          element={<TotalCostProductPage searchTerm={searchTerm} onSearchChange={handleSearchChange} />}
        />
        <Route
          path="*"
          element={<div>404 Page Not Found</div>}
        />
      </Routes>
    </Router>
  );
}

export default App;
