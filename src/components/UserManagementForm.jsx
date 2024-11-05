// UserManagementForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader(UserManagement)"; // Import Header component
import Select from "react-select";
import "../styles/UserManagementForm.css";

function UserManagementForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    console.log({
      username,
      email,
      password,
      confirmPassword,
      role,
    });
  };

  const handleCancel = () => {
    navigate("/user-management");
  };

  return (
    <div className="admin-dashboard">
    <div className="main-section">
      <AdminHeader />
      <div className="user-management-container">
        <div className="user-management-form">
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Konfirmasi Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Hak Akses</label>
              <Select
                  options={[
                    { value: "role1", label: "Admin" },
                    { value: "role2", label: "Operator" },
                    { value: "role3", label: "User" },
                  ]}
                  onChange={(selectedOption) => setRole(selectedOption.value)}
                  placeholder="Pilih Hak Akses"
                  className="select-input"
                />
            </div>
            <div className="form-actions">
              <button type="submit" className="save-button">
                Simpan
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>  
  );
}

export default UserManagementForm;
