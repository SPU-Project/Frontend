import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../redux/productTableSlice";
import {
  fetchStatusProduksi,
  deleteStatusProduksi,
} from "../redux/statusprodukSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button } from "react-bootstrap";
import "../styles/StatusProductTable.css";

function StatusProductTable({ searchTerm = "", onSearchChange }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Ambil state dari statusproduksi slice
  const {
    items: products,
    loading,
    error,
  } = useSelector((state) => state.statusproduksi);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  useEffect(() => {
    // Saat pertama kali mount, fetch data statusproduksi
    dispatch(fetchStatusProduksi());
  }, [dispatch]);

  // Filter pencarian
  const filteredProducts = products.filter((product) =>
    product.NamaProduk.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    // Navigasi ke form
    navigate("/status-product-form");
  };

  const handleEdit = (id) => {
    // route ke form update
    navigate(`/status-product-form/${id}`);
  };

  // 1) handleDelete -> menyiapkan konfirmasi
  const handleDelete = (id) => {
    setShowDeleteConfirmation(true);
    setIdToDelete(id);
    setModalMessage("Apakah Anda yakin ingin menghapus produk ini?");
    setShowModal(true);
  };

  // 2) handleDeleteConfirmation -> benar-benar menghapus
  const handleDeleteConfirmation = async () => {
    await dispatch(deleteStatusProduksi(idToDelete));
    setShowDeleteConfirmation(false);
    setShowModal(false);
    setIdToDelete(null);
    // Jika perlu, panggil fetchStatusProduksi() atau setModalMessage dsb.
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowDeleteConfirmation(false);
  };

  if (loading) {
    return <div>Memuat data status produksi...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="admin-table">
      <div className="table-controls">
        <button className="add-button" onClick={handleAddProduct}>
          <FontAwesomeIcon icon={faPlus} /> Tambah Produksi
        </button>
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="    Cari Produk"
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
              <th>Kode Produk</th>
              <th>Tanggal Produksi</th>
              <th>Nama Produk</th>
              <th>Batch</th>
              <th>Satuan</th>
              <th>Jumlah Produksi</th>
              <th>Status Produksi</th>
              <th>Tanggal Selesai</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td>{product.KodeProduksi}</td>
                  <td>
                    {product.TanggalProduksi
                      ? new Date(product.TanggalProduksi).toLocaleString(
                          "id-ID"
                        )
                      : ""}
                  </td>
                  <td>{product.NamaProduk}</td>
                  <td>{product.Batch}</td>
                  <td>{product.Satuan}</td>
                  <td>{product.JumlahProduksi}</td>
                  <td>{product.StatusProduksi}</td>
                  <td>
                    {product.TanggalSelesai
                      ? new Date(product.TanggalSelesai).toLocaleString("id-ID")
                      : ""}
                  </td>
                  <td>
                    <button
                      className="delete-product-button"
                      onClick={() => handleDelete(product.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">Tidak ada produk yang ditemukan</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Modal */}
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
      </div>
    </div>
  );
}

export default StatusProductTable;
