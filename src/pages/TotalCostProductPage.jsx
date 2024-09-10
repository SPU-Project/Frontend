import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import TotalCostProductTable from '../components/TotalCostProductTable'; // Pastikan path benar
import '../styles/TotalCostProductPage.css'; // Buat file CSS jika diperlukan

const TotalCostProductPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="admin-dashboard">
    <AdminSidebar />
    <div className="main-section">
      <AdminHeader />
      <div className="total-cost-product-page">
      <TotalCostProductTable 
        searchTerm={searchTerm} 
        onSearchChange={handleSearchChange}
      />
    </div>
    </div>
  </div>

  );
};

export default TotalCostProductPage;