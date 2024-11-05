import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader(LogHistory)";
import LogHistoryTable from "../components/LogHistoryTable";
import "../styles/LogHistoryPage.css";

function LogHistoryPage() {
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
        <LogHistoryTable
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
      </div>
    </div>
  );
}

export default LogHistoryPage;
