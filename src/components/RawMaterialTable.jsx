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
import { Modal, Button } from "react-bootstrap";

const RawMaterialsTable = () => {
  const dispatch = useDispatch();

  const bahanBaku = useSelector((state) => state.bahanBaku.items);
  const status = useSelector((state) => state.bahanBaku.status);
  const [searchTerm, setSearchTerm] = useState("");
  const [formBahanBaku, setFormBahanBaku] = useState("");
  const [formHarga, setFormHarga] = useState("");
  const [editId, setEditId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBahanBaku());
    }
  }, [dispatch, status]);

  // Fungsi untuk memformat harga ke dalam format Rupiah
  const formatRupiah = (angka) => {
    const formattedNumber = angka
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `Rp. ${formattedNumber}`;
  };

  const handleSimpan = async (e) => {
    e.preventDefault();

    if (!formBahanBaku || !formHarga) {
      setErrorMessage("Harap masukkan Bahan Baku dan Harga!");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(formBahanBaku)) {
      setErrorMessage("Bahan baku harus diisi dengan huruf");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return;
    }

    if (isNaN(formHarga) || parseFloat(formHarga) < 0) {
      setErrorMessage("Harga hanya bisa diisi dengan Angka");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return;
    }

    setErrorMessage("");
    setLoading(true);

    if (editId) {
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
          setTimeout(() => setSuccessMessage(""), 3000);
          dispatch(fetchBahanBaku());
        });
      setEditId(null);
    } else {
      await dispatch(
        addBahanBaku({
          BahanBaku: formBahanBaku,
          Harga: formHarga,
        })
      )
        .unwrap()
        .then(() => {
          setSuccessMessage("Bahan Baku berhasil ditambahkan!");
          setTimeout(() => setSuccessMessage(""), 3000);
          dispatch(fetchBahanBaku());
        });
    }

    setLoading(false);
    setFormBahanBaku("");
    setFormHarga("");
  };

  const handleUbah = (id) => {
    const itemToEdit = bahanBaku.find((item) => item.id === id);

    if (itemToEdit) {
      setFormBahanBaku(itemToEdit.BahanBaku);
      setFormHarga(itemToEdit.Harga);
      setEditId(id);
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
      const { error, payload } = await dispatch(deleteBahanBaku(idToDelete));

      if (error) {
        if (payload.includes("Bahan Baku tidak dapat dihapus")) {
          setModalMessage(
            "Bahan Baku tidak dapat dihapus karena sedang digunakan oleh Produk"
          );
        } else {
          setModalMessage(`Terjadi kesalahan: ${payload}`);
        }
      } else {
        setModalMessage("Bahan Baku berhasil dihapus!");
      }

      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
      setShowDeleteConfirmation(false);
    } catch (error) {
      setModalMessage("Maaf, terjadi kesalahan saat menghapus Bahan Baku.");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowDeleteConfirmation(false);
  };

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
            className="form-input"
          />
        </div>

        {errorMessage && (
          <div className="message error-message">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="message success-message">{successMessage}</div>
        )}

        <div className="button-group-container">
          <button type="submit" className="button-group" disabled={loading}>
            {loading ? <div className="spinner"></div> : "Simpan"}
          </button>
        </div>
      </form>

      <div className="table-controls">
        <div className="search-container">
          <FontAwesomeIcon
            icon={faSearch}
            className={`search-icon ${searchTerm ? "hidden" : ""}`}
          />
          <input
            type="text"
            placeholder="      Cari Bahan Baku"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
              <td>{formatRupiah(item.Harga)}</td>
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
  );
};

export default RawMaterialsTable;
