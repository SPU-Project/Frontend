import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import ProductTable from '../components/ProductTable';
import '../styles/ProductsPage.css';

function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="main-section">
        <AdminHeader />
        <ProductTable searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      </div>
    </div>
  );
}

export default ProductsPage;
