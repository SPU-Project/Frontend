import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../redux/productTableSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button } from "react-bootstrap";
import "../styles/ProductTable.css";

function StatusProdukTable({ searchTerm = "", onSearchChange }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.productTable
  );

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products.filter((product) =>
    product.produk.namaProduk.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product) => {
    navigate(`/edit-product/${product.produkId}`, { state: { product } });
  };

  const handleDelete = (id) => {
    setShowDeleteConfirmation(true);
    setIdToDelete(id);
    setModalMessage("Apakah Anda yakin ingin menghapus produk ini?");
    setShowModal(true);
  };

  const handleDeleteConfirmation = async () => {
    try {
      const { error } = await dispatch(deleteProduct(idToDelete));
      if (error) {
        setModalMessage("Terjadi kesalahan saat menghapus produk.");
      } else {
        setModalMessage("Produk berhasil dihapus!");
        dispatch(fetchProducts());
      }
    } catch (error) {
      setModalMessage("Terjadi kesalahan.");
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
    navigate("/form-status");
  };

  if (loading) {
    return <div>Memuat data produk...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
              <th>Nama Produk</th>
              <th>Tanggal Produksi</th>
              <th>Jumlah Produksi</th>
              <th>Terjual</th>
              <th>Harga Satuan</th>
              <th>Pendapatan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td>{product.produk.namaProduk}</td>
                  <td>{product.produk.tanggalProduksi}</td>
                  <td>{product.produk.jumlahProduksi}</td>
                  <td>{product.produk.terjual}</td>
                  <td>{`Rp. ${parseFloat(
                    product.produk.hargaSatuan
                  ).toLocaleString()}`}</td>
                  <td>{`Rp. ${(
                    product.produk.terjual * product.produk.hargaSatuan
                  ).toLocaleString()}`}</td>
                  <td>
                    <button
                      className="edit-product-button"
                      onClick={() => handleEdit(product)}
                    >
                      Ubah
                    </button>
                    <button
                      className="delete-product-button"
                      onClick={() => handleDelete(product.produkId)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">Tidak ada produk yang ditemukan</td>
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

export default StatusProdukTable;
