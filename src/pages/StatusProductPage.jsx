import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import StatusProductTable from "../components/StatusProductTable";
import "../styles/StatusProductPage.css";

function StatusProductsPage() {
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
        <StatusProductTable
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
      </div>
    </div>
  );
}

export default StatusProductsPage;
