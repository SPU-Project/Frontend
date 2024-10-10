import React from 'react';
import '../styles/AdminHeader.css';
import Logo from '../assets/images/Logo.png'; // Import gambar

function AdminHeader() {
  return (
    <header className="admin-header">
      <h2>Bahan Baku</h2>
      <img src={Logo} alt="Logo" className="logo" />
    </header>
  );
}

export default AdminHeader;
