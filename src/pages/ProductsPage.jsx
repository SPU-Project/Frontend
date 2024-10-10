import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import ProductTable from "../components/ProductTable";
import "../styles/ProductsPage.css";

function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const [isSidebarVisible, setSidebarVisibility] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisibility(!isSidebarVisible);
  };

  return (
    <div className="admin-dashboard">
      <button onClick={toggleSidebar} className="hamburger-button">
        ☰
      </button>
      {isSidebarVisible && (
        <div className="admin-sidebar">
          <AdminSidebar />
        </div>
      )}
      <div className={`main-section ${isSidebarVisible ? "shrink" : "expand"}`}>
        <AdminHeader />
        <ProductTable
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
      </div>
    </div>
  );
}

export default ProductsPage;
