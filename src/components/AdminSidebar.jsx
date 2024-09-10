import React from 'react';
import { Link } from 'react-router-dom'; // Import Link untuk navigasi
import '../styles/AdminSidebar.css';
import UserPic from '../assets/images/UserPic.png'; // Import gambar

function AdminSidebar() {
  return (
    <nav className="admin-sidebar">
      <div className="profile">
        <img src={UserPic} alt="Profile" />
        <h3>User</h3>
      </div>
      <ul>
        <hr style={{ width: '100%', borderWidth: '4px', borderColor: 'white' }} />
        <li>
          <Link to="/raw-materials">Bahan Baku</Link> {/* Gunakan Link untuk navigasi */}
        </li>
        <li>
          <Link to="/products">Produk</Link> {/* Gunakan Link untuk navigasi */}
        </li>
        <hr style={{ width: '100%', borderWidth: '4px', borderColor: 'white' }} />
        <li>
          <Link to="/">Keluar</Link> {/* Gunakan Link untuk navigasi */}
        </li>
      </ul>
    </nav>
  );
}

export default AdminSidebar;
