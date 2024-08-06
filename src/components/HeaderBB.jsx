import React from 'react';
import { Navbar } from 'react-bootstrap';
import './HeaderBB.css';

const Header = () => {
  return (
    <Navbar bg="light" className="header">
      <Navbar.Brand href="#home" className="mx-auto">
        <img src="../assets/images/Logo.png" alt="SPU Logo" className="logo" />
        Bahan Baku
      </Navbar.Brand>
    </Navbar>
  );
};

export default Header;