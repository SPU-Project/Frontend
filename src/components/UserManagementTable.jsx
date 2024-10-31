import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserManagementTable.css";
import "../styles/RawMaterialTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button } from "react-bootstrap";

function UserManagementTable({ searchTerm = "", onSearchChange }) {
  const navigate = useNavigate();

  // Dummy user data
  const [users, setUsers] = useState([
    {
      id: 1,
      penggunaId: 101,
      namaPengguna: "user1",
      email: "user1@example.com",
      password: 123,
      role: "admin",
    },
    {
      id: 2,
      penggunaId: 102,
      namaPengguna: "user2",
      email: "user2@example.com",
      password: 123,
      role: "operator",
    },
    {
      id: 3,
      penggunaId: 103,
      namaPengguna: "user3",
      email: "user3@example.com",
      password: 123,
      role: "pengguna",
    },
  ]);

  // Modal and confirmation states
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const filteredUsers = users.filter((user) =>
    user.namaPengguna.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user) => {
    navigate(`/form/${user.penggunaId}`, { state: { user } });
  };

  const handleDelete = (id) => {
    setShowDeleteConfirmation(true);
    setIdToDelete(id);
    setModalMessage("Anda yakin ingin menghapus pengguna ini?");
    setShowModal(true);
  };

  const handleDeleteConfirmation = () => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.penggunaId !== idToDelete)
    );
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
        <button className="add-button" onClick={handleAddUser}>
          <FontAwesomeIcon icon={faPlus} /> Tambah Pengguna
        </button>
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
              <th>Email</th>
              <th>Password</th>
              <th>Hak Akses</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.namaPengguna}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="edit-product-button"
                      onClick={() => handleEdit(user)}
                    >
                      Ubah
                    </button>
                    <button
                      className="delete-product-button"
                      onClick={() => handleDelete(user.penggunaId)}
                    >
                      Hapus
                    </button>
                  </td>
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

export default UserManagementTable;
