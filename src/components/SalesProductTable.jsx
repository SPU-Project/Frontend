import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPenjualanProduks,
  deletePenjualanProduk,
  updatePenjualanProduk,
} from "../redux/penjualanProdukSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faEdit,
  faTrash,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, Button } from "react-bootstrap";
import "../styles/SalesProductTable.css";

function SalesProductTable({ searchTerm = "", onSearchChange }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Ambil state dari penjualanproduk slice
  const { items, loading /*, error */ } = useSelector(
    (state) => state.penjualanproduk
  );

  // State untuk inline editing kolom "Terjual"
  const [editingRowTerjual, setEditingRowTerjual] = useState(null);
  const [tempTerjual, setTempTerjual] = useState({});

  // Modal States untuk delete confirmation
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  // Modal State untuk update notifikasi (berhasil/gagal)
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateModalMessage, setUpdateModalMessage] = useState("");

  useEffect(() => {
    // Fetch data penjualan-produk saat komponen mount
    dispatch(fetchPenjualanProduks());
  }, [dispatch]);

  // Filter search
  const filteredData = items.filter((prod) =>
    prod.NamaProduk.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Untuk mengaktifkan mode edit inline di kolom "Terjual"
  const handleEditTerjual = (prod) => {
    setEditingRowTerjual(prod.id);
    setTempTerjual({ ...tempTerjual, [prod.id]: prod.Terjual });
  };

  // Simpan update terjual secara inline dengan notifikasi modal
  const handleSaveTerjual = async (prod) => {
    // Buat payload berdasarkan data yang ada, ganti Terjual dengan nilai baru
    const updatedData = {
      NamaProduk: prod.NamaProduk,
      Batch: prod.Batch,
      Margin: prod.Margin,
      Terjual: tempTerjual[prod.id], // nilai baru dari state
    };

    try {
      await dispatch(
        updatePenjualanProduk({ id: prod.id, updatedData })
      ).unwrap();
      setEditingRowTerjual(null);
      // Tampilkan modal notifikasi berhasil
      setUpdateModalMessage("Update berhasil!");
      setShowUpdateModal(true);
      setTimeout(() => setShowUpdateModal(false), 2000);
    } catch (error) {
      console.error("Update Gagal", error);
      const errMsg = error.message ? error.message : error;
      // Tampilkan modal notifikasi error
      setUpdateModalMessage("Update Gagal : " + errMsg);
      setShowUpdateModal(true);
      setTimeout(() => setShowUpdateModal(false), 2000);
    }
  };

  // Batalkan mode edit untuk kolom Terjual
  const handleCancelTerjual = () => {
    setEditingRowTerjual(null);
  };

  // Fungsi delete (sama seperti sebelumnya)
  const handleDelete = (id) => {
    setShowDeleteConfirmation(true);
    setIdToDelete(id);
    setModalMessage("Apakah Anda yakin ingin menghapus data penjualan ini?");
    setShowModal(true);
  };

  const handleDeleteConfirmation = async () => {
    try {
      await dispatch(deletePenjualanProduk(idToDelete));
      setModalMessage("Data berhasil dihapus!");
    } catch (err) {
      setModalMessage("Terjadi kesalahan saat menghapus data.");
    } finally {
      setShowDeleteConfirmation(false);
      setTimeout(() => setShowModal(false), 2000);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowDeleteConfirmation(false);
  };

  const handleAddProduct = () => {
    // Navigasi ke form sales (create)
    navigate("/form-sales");
  };

  if (loading) {
    return <div>Memuat data penjualan produk...</div>;
  }

  return (
    <div className="admin-table">
      <div className="table-controls">
        <button className="add-button" onClick={handleAddProduct}>
          <FontAwesomeIcon icon={faPlus} /> Tambah Produk
        </button>
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Cari Penjualan Produk"
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
              <th>Nama Produk</th>
              <th>Batch</th>
              <th>Jumlah Produksi</th>
              <th>Terjual</th>
              <th>Harga Satuan</th>
              <th>Pendapatan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((prod, index) => (
                <tr key={prod.id}>
                  <td>{index + 1}</td>
                  <td>{prod.NamaProduk}</td>
                  <td>{prod.Batch}</td>
                  <td>{prod.JumlahProduksi}</td>
                  <td>
                    {editingRowTerjual === prod.id ? (
                      <div>
                        <input
                          type="number"
                          value={tempTerjual[prod.id] || ""}
                          onChange={(e) =>
                            setTempTerjual({
                              ...tempTerjual,
                              [prod.id]: e.target.value,
                            })
                          }
                        />
                        <button
                          className="save-inline-button"
                          onClick={() => handleSaveTerjual(prod)}
                          style={{ marginLeft: "4px" }}
                        >
                          <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                          className="cancel-inline-button"
                          onClick={handleCancelTerjual}
                          style={{ marginLeft: "4px" }}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    ) : (
                      prod.Terjual
                    )}
                  </td>
                  <td>Rp {parseFloat(prod.HargaSatuan).toLocaleString()}</td>
                  <td>Rp {parseFloat(prod.Pendapatan).toLocaleString()}</td>
                  <td>
                    {editingRowTerjual !== prod.id && (
                      <>
                        <button
                          className="edit-product-button"
                          onClick={() => handleEditTerjual(prod)}
                          style={{ marginRight: "8px" }}
                        >
                          <FontAwesomeIcon icon={faEdit} /> Ubah
                        </button>
                        <button
                          className="delete-product-button"
                          onClick={() => handleDelete(prod.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} /> Hapus
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">Tidak ada data penjualan yang ditemukan</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Modal untuk konfirmasi delete */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Konfirmasi</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalMessage}</Modal.Body>
          {showDeleteConfirmation && (
            <Modal.Footer>
              <Button variant="danger" onClick={handleDeleteConfirmation}>
                Hapus
              </Button>
              <Button variant="secondary" onClick={handleCloseModal}>
                Batal
              </Button>
            </Modal.Footer>
          )}
        </Modal>

        {/* Modal untuk notifikasi update */}
        <Modal
          show={showUpdateModal}
          onHide={() => setShowUpdateModal(false)}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body>{updateModalMessage}</Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default SalesProductTable;
