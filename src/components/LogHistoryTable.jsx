import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LogHistoryTable.css";
import "../styles/RawMaterialTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button } from "react-bootstrap";

function LogHistoryTable({ searchTerm = "", onSearchChange }) {
  const navigate = useNavigate();

  // Dummy user data
  const [users, setUsers] = useState([
    {
      id: 3,
      penggunaId: 103,
      namaPengguna: "user1",
      role: "Admin",
      date: "2024-10-28 13:10:07",
      keterangan: "Menambah Bahan Baku",
    },
    {
      id: 3,
      penggunaId: 103,
      namaPengguna: "user2",
      role: "Admin",
      date: "2024-10-28 13:10:07",
      keterangan: "Menambah Bahan Baku",
    },
    {
      id: 3,
      penggunaId: 103,
      namaPengguna: "user3",
      role: "Admin",
      date: "2024-10-28 13:10:07",
      keterangan: "Menambah Bahan Baku",
    },
  ]);

  // Modal and confirmation states
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const filteredUsers = users.filter((user) =>
    user.namaPengguna.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteConfirmation = () => {
    setModalMessage("Pengguna berhasil dihapus!");
    setTimeout(() => setShowModal(false), 2000);
    setShowDeleteConfirmation(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowDeleteConfirmation(false);
  };

  const handleAddUser = () => {
    navigate("/user-management-form");
  };

  return (
    <div className="admin-table">
      <div className="table-controls">
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Cari Pengguna"
            value={searchTerm}
            onChange={onSearchChange}
            className="search-input"
          />
        </div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Username</th>
              <th>Hak Akses</th>
              <th>Waktu</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.namaPengguna}</td>
                  <td>{user.role}</td>
                  <td>{user.date}</td>
                  <td>{user.keterangan}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Tidak ada pengguna yang ditemukan</td>
              </tr>
            )}
          </tbody>
        </table>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Informasi</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalMessage}</Modal.Body>
          <Modal.Footer>
            {showDeleteConfirmation && (
              <>
                <Button variant="danger" onClick={handleDeleteConfirmation}>
                  Hapus
                </Button>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Batal
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default LogHistoryTable;
