import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBahanBaku,
  deleteBahanBaku,
  updateBahanBaku,
  addBahanBaku,
} from "../redux/bahanbakuslice";
import "../styles/RawMaterialTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const RawMaterialsTable = () => {
  const dispatch = useDispatch();

  const bahanBaku = useSelector((state) => state.bahanBaku.items);
  const status = useSelector((state) => state.bahanBaku.status);
  const [searchTerm, setSearchTerm] = useState(""); // Untuk pencarian
  const [formBahanBaku, setFormBahanBaku] = useState("");
  const [formHarga, setFormHarga] = useState("");
  const [editId, setEditId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // Untuk pesan kesalahan
  const [successMessage, setSuccessMessage] = useState(""); // Untuk pesan sukses
  const [loading, setLoading] = useState(false); // Loading state

  // Modal Efek Hapus
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  // Fetch data ketika komponen dimuat
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBahanBaku());
    }
  }, [dispatch, status]);

  // Fungsi untuk menyimpan data baru atau memperbarui data yang ada
  const handleSimpan = async (e) => {
    e.preventDefault();

    // Validasi form
    if (!formBahanBaku || !formHarga) {
      setErrorMessage("Harap masukkan Bahan Baku dan Harga!");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return;
    }

    // Validasi Bahan Baku
    if (!/^[a-zA-Z\s]+$/.test(formBahanBaku)) {
      setErrorMessage("Bahan baku harus diisi dengan huruf");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return;
    }

    // Validasi Harga
    if (isNaN(formHarga) || parseFloat(formHarga) < 0) {
      setErrorMessage("Harga hanya bisa diisi dengan Angka");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return;
    }

    setErrorMessage(""); // Bersihkan pesan error jika validasi lulus
    setLoading(true);

    if (editId) {
      // Jika ada id yang diedit, lakukan update
      await dispatch(
        updateBahanBaku({
          id: editId,
          BahanBaku: formBahanBaku,
          Harga: formHarga,
        })
      )
        .unwrap()
        .then(() => {
          setSuccessMessage("Bahan Baku berhasil diupdate!");
          setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
          dispatch(fetchBahanBaku()); // Fetch ulang data setelah update
        });
      setEditId(null); // Reset editId setelah menyimpan
    } else {
      // Jika tidak ada editId, tambahkan data baru
      await dispatch(
        addBahanBaku({
          BahanBaku: formBahanBaku,
          Harga: formHarga,
        })
      )
        .unwrap()
        .then(() => {
          setSuccessMessage("Bahan Baku berhasil ditambahkan!");
          setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
          dispatch(fetchBahanBaku()); // Fetch ulang data setelah tambah data
        });
    }

    setLoading(false);
    setFormBahanBaku("");
    setFormHarga("");
  };

  // Fungsi untuk mengisi form dengan data yang ingin diedit
  const handleUbah = (id) => {
    const itemToEdit = bahanBaku.find((item) => item.id === id);

    if (itemToEdit) {
      console.log("Editing item:", itemToEdit); // Logging untuk memeriksa data yang akan diedit
      // Mengisi form dengan data yang ingin diubah
      setFormBahanBaku(itemToEdit.BahanBaku); // Nama bahan baku yang ingin diubah
      setFormHarga(itemToEdit.Harga); // Harga bahan baku yang ingin diubah
      setEditId(id); // Set ID item yang sedang diedit agar saat disimpan dapat terupdate
    } else {
      console.error("Item not found for ID:", id); // Log jika item tidak ditemukan
    }
  };

  const handleHapus = async (id) => {
    try {
      setShowDeleteConfirmation(true);
      setIdToDelete(id);
      setModalMessage("Anda yakin ingin menghapus bahan baku ini?");
      setShowModal(true);
    } catch (error) {
      setModalMessage("Maaf, terjadi kesalahan saat menghapus Bahan Baku.");
      setShowModal(true);
    }
  };

  const handleDeleteConfirmation = async () => {
    try {
      // Dispatch the deleteBahanBaku action directly
      const { error, payload } = await dispatch(deleteBahanBaku(idToDelete));

      if (error) {
        // Periksa apakah pesan error mengandung "Bahan Baku tidak dapat dihapus"
        if (payload.includes("Bahan Baku tidak dapat dihapus")) {
          setModalMessage(
            "Bahan Baku tidak dapat dihapus karena sedang digunakan oleh Produk"
          );
          setShowModal(true);
          setTimeout(() => {
            setShowModal(false);
          }, 2000);
        } else {
          setModalMessage(`Terjadi kesalahan: ${payload}`);
          setShowModal(true);
          setTimeout(() => {
            setShowModal(false);
          }, 2000);
        }
      } else {
        // Jika penghapusan berhasil, item telah dihapus dari state
        setModalMessage("Bahan Baku berhasil dihapus!");
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
        }, 2000);
        setShowDeleteConfirmation(false); // Hide the delete confirmation after success
      }
    } catch (error) {
      setModalMessage("Maaf, terjadi kesalahan saat menghapus Bahan Baku.");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
    } finally {
      setShowDeleteConfirmation(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowDeleteConfirmation(false);
  };

  // Fungsi untuk menyaring hasil pencarian
  const filteredData = bahanBaku.filter((item) =>
    item.BahanBaku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-table-container">
      <form onSubmit={handleSimpan} className="form-container">
        <div className="form-group">
          <label htmlFor="formBahanBaku" className="text-form">
            Bahan Baku
          </label>
          <input
            type="text"
            id="formBahanBaku"
            placeholder="Enter Bahan Baku"
            value={formBahanBaku}
            onChange={(e) => setFormBahanBaku(e.target.value)}
            aria-label="Input Bahan Baku"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="formHargaKilo" className="text-form">
            Harga/Kilo
          </label>
          <input
            type="text"
            id="formHargaKilo"
            placeholder="Enter Harga/Kilo"
            value={formHarga}
            onChange={(e) => setFormHarga(e.target.value)}
            aria-label="Input Harga per Kilo"
            className="form-input"
          />
        </div>

        {/* Tampilkan pesan error jika inputan kosong */}
        {errorMessage && (
          <div className="message error-message">
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Tampilkan pesan sukses setelah update/tambah */}
        {successMessage && (
          <div className="message success-message">
            <p>{successMessage}</p>
          </div>
        )}

        <div className="button-group-container">
          <button type="submit" className="button-group" disabled={loading}>
            {loading ? (
              <div className="spinner"></div>
            ) : (
              "Simpan"
            )}
          </button>
        </div>
      </form>

      <div className="table-controls">
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Cari Bahan Baku"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Cari Bahan Baku"
          />
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Bahan Baku</th>
            <th>Harga/kg</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.BahanBaku}</td>
              <td>{item.Harga}</td>
              <td>
                <button
                  onClick={() => handleUbah(item.id)}
                  className="action-button"
                >
                  Ubah
                </button>
                <button
                  onClick={() => handleHapus(item.id)}
                  className="btn-danger"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Kustom */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Informasi</h2>
              <span className="close-button" onClick={handleCloseModal}>
                &times;
              </span>
            </div>
            <div className="modal-body">
              <p>{modalMessage}</p>
            </div>
            <div className="modal-footer">
              {showDeleteConfirmation && (
                <>
                  <button
                    className="btn-danger modal-button"
                    onClick={handleDeleteConfirmation}
                  >
                    Hapus
                  </button>
                  <button
                    className="btn-secondary modal-button"
                    onClick={handleCloseModal}
                  >
                    Batal
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RawMaterialsTable;
