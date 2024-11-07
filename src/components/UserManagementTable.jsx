import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserManagementTable.css";
import "../styles/RawMaterialTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../redux/userManagementSlice"; // Import actions

function UserManagementTable({ searchTerm = "", onSearchChange }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch users when component mounts
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Get users from Redux store
  const { users, loading, error } = useSelector(
    (state) => state.userManagement
  );

  // Modal and confirmation states
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user) => {
    navigate(`/user-management-form/${user.id}`);
  };

  const handleDelete = (id) => {
    setShowDeleteConfirmation(true);
    setIdToDelete(id);
    setModalMessage("Anda yakin ingin menghapus pengguna ini?");
    setShowModal(true);
  };

  const handleDeleteConfirmation = () => {
    dispatch(deleteUser(idToDelete))
      .unwrap()
      .then(() => {
        setModalMessage("Pengguna berhasil dihapus!");
        setTimeout(() => setShowModal(false), 2000);
        setShowDeleteConfirmation(false);
      })
      .catch((error) => {
        setModalMessage(`Gagal menghapus pengguna: ${error}`);
        setTimeout(() => setShowModal(false), 2000);
        setShowDeleteConfirmation(false);
      });
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
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Username</th>
                <th>Email</th>
                {/* You should not display passwords */}
                {/* <th>Password</th> */}
                <th>Hak Akses</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    {/* Passwords should not be displayed */}
                    {/* <td>{user.password}</td> */}
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
                        onClick={() => handleDelete(user.id)}
                      >
                        Hapus
                      </button>
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

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Informasi</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalMessage}</Modal.Body>
          <Modal.Footer>
            {showDeleteConfirmation ? (
              <>
                <Button variant="danger" onClick={handleDeleteConfirmation}>
                  Hapus
                </Button>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Batal
                </Button>
              </>
            ) : (
              <Button variant="secondary" onClick={handleCloseModal}>
                Tutup
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default UserManagementTable;
