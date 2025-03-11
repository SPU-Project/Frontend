// UserManagementForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminHeader from "./AdminHeader(UserManagement)"; // Import Header component
import Select from "react-select";
import "../styles/StatusProductForm.css";
import { useDispatch, useSelector } from "react-redux";
import {
  createStatusProduksi,
  fetchStatusProduksi,
} from "../redux/statusprodukSlice";
import { fetchProducts } from "../redux/productTableSlice"; // import
import { addUser, updateUser, fetchUsers } from "../redux/userManagementSlice";
import { Modal } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

function StatusProductForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams(); // Get id from URL if editing
  const isEditing = !!id;
  const [date, setDate] = useState(new Date());

  // State loading & error (opsional, bisa ambil dari store)
  const { users, loading, error } = useSelector(
    (state) => state.statusproduksi
  );

  const { products } = useSelector((state) => state.productTable);

  // 2) Ketika mount, dispatch(fetchProducts) untuk mengisi productTable.products
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // 3) State form untuk StatusProduksi
  const [formData, setFormData] = useState({
    KodeProduksi: "",
    TanggalProduksi: new Date(),
    TanggalSelesai: null,
    Batch: "",
    Satuan: "",
    JumlahProduksi: "",
    StatusProduksi: "Dalam Proses",
  });

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      // Kita ubah TanggalProduksi & TanggalSelesai ke format string (ISO)
      const payload = {
        ...formData,
        TanggalProduksi: formData.TanggalProduksi
          ? formData.TanggalProduksi.toISOString()
          : null,
        TanggalSelesai: formData.TanggalSelesai
          ? formData.TanggalSelesai.toISOString()
          : null,
      };

      // dispatch createStatusProduksi
      const resultAction = await dispatch(
        createStatusProduksi(payload)
      ).unwrap();

      // Jika sukses
      setModalTitle("Sukses");
      setModalMessage("StatusProduksi berhasil ditambahkan");
      setShowModal(true);

      // Tunggu 2 detik lalu tutup modal & navigate
      setTimeout(() => {
        setShowModal(false);
        navigate("/status-product"); // misal route table
      }, 2000);
    } catch (err) {
      setModalTitle("Error");
      setModalMessage(`Gagal menambahkan: ${err}`);
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
    }
  };

  const handleCancel = () => {
    navigate("/status-product");
  };

  // 4) Buat options dari 'products'
  const kodeProduksiOptions = products.map((p) => ({
    value: p.KodeProduksi,
    label: p.KodeProduksi,
  }));

  const selectedKode =
    kodeProduksiOptions.find((opt) => opt.value === formData.KodeProduksi) ||
    null;

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

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

  const roleOptions = [
    { value: "Admin", label: "Admin" },
    { value: "Operator", label: "Operator" },
    { value: "User", label: "User" },
  ];

  return (
    <div className="status-product-form">
      <div className="main-section">
        <AdminHeader />
        <div className="user-management-container">
          <div className="user-management-form">
            <form onSubmit={handleSave}>
              {/* Dropdown KodeProduksi */}
              <div className="form-group">
                <label>Kode Produksi</label>
                <Select
                  options={kodeProduksiOptions}
                  value={selectedKode}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      KodeProduksi: selectedOption.value,
                    })
                  }
                  placeholder="Pilih KodeProduksi..."
                />
              </div>

              <div className="form-group">
                <label>Tanggal Produksi</label>
                <DatePicker
                  selected={formData.TanggalProduksi}
                  onChange={(date) =>
                    setFormData({ ...formData, TanggalProduksi: date })
                  }
                  dateFormat="yyyy-MM-dd"
                />
              </div>

              <div className="form-group">
                <label>Tanggal Selesai</label>
                <DatePicker
                  selected={formData.TanggalSelesai}
                  onChange={(date) =>
                    setFormData({ ...formData, TanggalSelesai: date })
                  }
                  dateFormat="yyyy-MM-dd"
                />
              </div>

              <div className="form-group">
                <label>Batch</label>
                <input
                  type="text"
                  value={formData.Batch}
                  onChange={(e) =>
                    setFormData({ ...formData, Batch: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Satuan</label>
                <input
                  type="text"
                  value={formData.Satuan}
                  onChange={(e) =>
                    setFormData({ ...formData, Satuan: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Jumlah Produksi</label>
                <input
                  type="number"
                  value={formData.JumlahProduksi}
                  onChange={(e) =>
                    setFormData({ ...formData, JumlahProduksi: e.target.value })
                  }
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

export default StatusProductForm;
