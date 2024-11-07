// UserManagementForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminHeader from "./AdminHeader(UserManagement)"; // Import Header component
import Select from "react-select";
import "../styles/UserManagementForm.css";
import { useDispatch, useSelector } from "react-redux";
import { addUser, updateUser, fetchUsers } from "../redux/userManagementSlice";
import { Modal } from "react-bootstrap";

function UserManagementForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams(); // Get id from URL if editing
  const isEditing = !!id;

  // Get user data from the Redux store if editing
  const { users, loading, error } = useSelector(
    (state) => state.userManagement
  );
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {
    if (isEditing) {
      // If users are not loaded yet, fetch them
      if (users.length === 0) {
        dispatch(fetchUsers());
      } else {
        // Find the user to edit
        const userToEdit = users.find((user) => user.id === parseInt(id));
        if (userToEdit) {
          setUserData({
            username: userToEdit.username,
            email: userToEdit.email,
            password: "", // Password should be blank
            confirmPassword: "",
            role: userToEdit.role,
          });
        } else {
          // User not found, navigate back
          navigate("/user-management");
        }
      }
    }
  }, [dispatch, id, isEditing, users, navigate]);

  const handleSave = (e) => {
    e.preventDefault();

    // Validasi password dan konfirmasi password
    if (userData.password !== userData.confirmPassword) {
      setModalTitle("Error");
      setModalMessage("Password dan konfirmasi password tidak cocok");
      setTimeout(() => setShowModal(false), 2000);
      setShowModal(true);
      return;
    }

    const { username, email, password, role } = userData;

    if (isEditing) {
      dispatch(
        updateUser({
          id,
          userData: {
            username,
            email,
            password,
            confPassword: userData.confirmPassword,
            role,
          },
        })
      )
        .unwrap()
        .then(() => {
          setModalTitle("Sukses");
          setModalMessage("Pengguna berhasil diperbarui");
          setShowModal(true);
          setTimeout(() => {
            setShowModal(false);
            navigate("/user-management");
          }, 2000);
        })
        .catch((error) => {
          setModalTitle("Error");
          setModalMessage(`Gagal memperbarui pengguna: ${error.msg || error}`);
          setShowModal(true);
          setTimeout(() => {
            setShowModal(false);
            navigate("/user-management");
          }, 2000);
        });
    } else {
      dispatch(
        addUser({
          username,
          email,
          password,
          confPassword: userData.confirmPassword,
          role,
        })
      )
        .unwrap()
        .then(() => {
          setModalTitle("Sukses");
          setModalMessage("Pengguna berhasil ditambahkan");
          setShowModal(true);
          setTimeout(() => {
            setShowModal(false);
            navigate("/user-management");
          }, 2000);
        })
        .catch((error) => {
          setModalTitle("Error");
          setModalMessage(`Gagal menambahkan pengguna: ${error.msg || error}`);
          setShowModal(true);
          setTimeout(() => {
            setShowModal(false);
            navigate("/user-management");
          }, 2000);
        });
    }
  };

  const handleCancel = () => {
    navigate("/user-management");
  };

  const roleOptions = [
    { value: "Admin", label: "Admin" },
    { value: "Operator", label: "Operator" },
    { value: "User", label: "User" },
  ];

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
                  value={userData.username}
                  onChange={(e) =>
                    setUserData({ ...userData, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>E-mail</label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={userData.password}
                  onChange={(e) =>
                    setUserData({ ...userData, password: e.target.value })
                  }
                  required={!isEditing} // Required only when adding a new user
                />
              </div>
              <div className="form-group">
                <label>Konfirmasi Password</label>
                <input
                  type="password"
                  value={userData.confirmPassword}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required={!isEditing} // Required only when adding a new user
                />
              </div>
              <div className="form-group">
                <label>Hak Akses</label>
                <Select
                  options={roleOptions}
                  value={roleOptions.find(
                    (option) => option.value === userData.role
                  )}
                  onChange={(selectedOption) =>
                    setUserData({ ...userData, role: selectedOption.value })
                  }
                  placeholder="Pilih Hak Akses"
                  className="select-input"
                  required
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
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            {/* Komponen Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>{modalTitle}</Modal.Title>
              </Modal.Header>
              <Modal.Body>{modalMessage}</Modal.Body>
              <Modal.Footer></Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagementForm;
