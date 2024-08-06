import React from 'react';
import { Nav } from 'react-bootstrap';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="profile">
        <img src="../assets/images/UserPic.png" alt="User" className="profile-pic" />
        <p className="profile-name">User</p>
      </div>
      <Nav className="flex-column">
        <Nav.Link href="#bahanbaku">Bahan Baku</Nav.Link>
        <Nav.Link href="#produk">Produk</Nav.Link>
        <Nav.Link href="#logout">Keluar</Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;