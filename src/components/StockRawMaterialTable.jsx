import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StockRawMaterialTable.css";
import "../styles/RawMaterialTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../redux/userManagementSlice";

function UserManagementTable({ searchTerm = "", onSearchChange }) {
  const dispatch = useDispatch();

  const [editingRow, setEditingRow] = useState(null);
  const [tempStock, setTempStock] = useState({});

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const { users, loading, error } = useSelector(
    (state) => state.userManagement
  );

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (userId, stock) => {
    setEditingRow(userId);
    setTempStock({ ...tempStock, [userId]: stock });
  };

  const handleSaveClick = (userId) => {
    // Logika penyimpanan (misalnya, dispatch ke Redux atau API call)
    console.log("Simpan perubahan untuk user dengan ID:", userId, "stok:", tempStock[userId]);

    setEditingRow(null); // Kembali ke mode non-edit
  };

  const handleStockChange = (userId, value) => {
    setTempStock({ ...tempStock, [userId]: value });
  };

  return (
    <div className="admin-table">
      <div className="table-controls">
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Cari Bahan Baku"
            value={searchTerm}
            onChange={onSearchChange}
            className="search-input"
          />
        </div>
      </div>
      <div className="table-wrapper">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Bahan Baku</th>
                <th>Stock/kg</th>
                <th>Tanggal Pembaruan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.username}</td>
                    <td>
                      {editingRow === user.id ? (
                        <input
                          type="number"
                          value={tempStock[user.id] || ""}
                          onChange={(e) => handleStockChange(user.id, e.target.value)}
                        />
                      ) : (
                        user.stock // Gantilah `user.stock` sesuai data yang tersedia
                      )}
                    </td>
                    <td>{user.updatedAt}</td>
                    <td>
                      {editingRow === user.id ? (
                        <button
                          className="save-button"
                          onClick={() => handleSaveClick(user.id)}
                        >
                          Simpan
                        </button>
                      ) : (
                        <button
                          className="edit-product-button"
                          onClick={() => handleEditClick(user.id, user.stock)}
                        >
                          Ubah
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Tidak ada pengguna yang ditemukan</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default UserManagementTable;
