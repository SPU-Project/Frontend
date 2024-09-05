import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import RawMaterialTable from '../components/RawMaterialTable';
import '../styles/RawMaterialsPage.css';

function RawMaterialsPage() {
  
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="main-section">
          <AdminHeader />
          <RawMaterialTable/>
        </div>
      </div>
    );
  }

export default RawMaterialsPage;