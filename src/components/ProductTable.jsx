import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProductTable.css";
import "../styles/RawMaterialTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, deleteProduct } from "../redux/productTableSlice";
import { Modal, Button } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";

function ProductTable({ searchTerm = "", onSearchChange }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.productTable
  );

  //Modal Efek Hapus
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products.filter((product) =>
    product.namaProduk.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Header PDF
    doc.setFontSize(18);
    doc.text("Daftar Produk", 14, 20);
    doc.setFontSize(12);
    doc.text(`Tanggal: ${new Date().toLocaleDateString()}`, 14, 30);

    // Data untuk tabel
const tableData = filteredProducts.map((product, index) => [
  index + 1,
  product.namaProduk,
  `Rp. ${parseFloat(product.hpp).toLocaleString("id-ID")}`,
  `Rp. ${parseFloat(product.margin20).toLocaleString("id-ID")}`,
  `Rp. ${parseFloat(product.margin30).toLocaleString("id-ID")}`,
  `Rp. ${parseFloat(product.margin40).toLocaleString("id-ID")}`,
  `Rp. ${parseFloat(product.margin50).toLocaleString("id-ID")}`,
  `Rp. ${parseFloat(product.margin60).toLocaleString("id-ID")}`,
  `Rp. ${parseFloat(product.margin70).toLocaleString("id-ID")}`,
  `Rp. ${parseFloat(product.margin80).toLocaleString("id-ID")}`,
  `Rp. ${parseFloat(product.margin90).toLocaleString("id-ID")}`,
  `Rp. ${parseFloat(product.margin100).toLocaleString("id-ID")}`,
]);

    // Kolom tabel
    const tableHeaders = [
      "No",
      "Produk",
      "HPP",
      "20%",
      "30%",
      "40%",
      "50%",
      "60%",
      "70%",
      "80%",
      "90%",
      "100%",
    ];

    // Tambahkan tabel ke PDF
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 40,
    });

    // Unduh PDF
    doc.save("Daftar_Produk.pdf");
  };

  const handleEdit = (product) => {
    navigate(`/form/${product.id}`, { state: { product } });
  };

  const handleDelete = async (id) => {
    try {
      setShowDeleteConfirmation(true);
      setIdToDelete(id);
      setModalMessage("Anda yakin ingin menghapus produk ini?");
      setShowModal(true);
    } catch (error) {
      setModalMessage("Maaf, terjadi kesalahan saat menghapus Produk.");
      setShowModal(true);
    }
  };

  const handleDeleteConfirmation = async () => {
    try {
      // Dispatch the deleteProduct action directly
      const { error, payload } = await dispatch(deleteProduct(idToDelete));

      if (error) {
        // Periksa apakah pesan error mengandung "Produk tidak dapat dihapus"
        if (payload.includes("Produk tidak dapat dihapus")) {
          setModalMessage(
            "Perhatian: Produk tidak dapat dihapus karena sedang digunakan"
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
        // Tidak perlu melakukan dispatch lagi
        setModalMessage("Produk berhasil dihapus!");
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          // Dispatch fetchProducts to refresh the product list
          dispatch(fetchProducts());
        }, 2000);
        setShowDeleteConfirmation(false); // Hide the delete confirmation after success
      }
    } catch (error) {
      setModalMessage("Maaf, terjadi kesalahan saat menghapus Produk.");
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

  const handleAddProduct = () => {
    navigate("/form");
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
        <button className="export-pdf-button-product" onClick={handleExportPDF}>
          <FontAwesomeIcon icon={faFilePdf} /> Export to PDF
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
              <th rowSpan="2">No</th>
              <th rowSpan="2">Kode Produksi</th>
              <th rowSpan="2">Produk</th>
              <th rowSpan="2">HPP</th>
              <th colSpan="9">Margin</th>
              <th rowSpan="2">Aksi</th>
            </tr>
            <tr>
              <th>20%</th>
              <th>30%</th>
              <th>40%</th>
              <th>50%</th>
              <th>60%</th>
              <th>70%</th>
              <th>80%</th>
              <th>90%</th>
              <th>100%</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td>{product.KodeProduksi}</td>
                  <td>{product.namaProduk}</td>
                  <td>{`Rp. ${parseFloat(product.hpp).toLocaleString(
                    "id-ID"
                  )}`}</td>
                  <td>{`Rp. ${parseFloat(product.margin20).toLocaleString(
                    "id-ID"
                  )}`}</td>
                  <td>{`Rp. ${parseFloat(product.margin30).toLocaleString(
                    "id-ID"
                  )}`}</td>
                  <td>{`Rp. ${parseFloat(product.margin40).toLocaleString(
                    "id-ID"
                  )}`}</td>
                  <td>{`Rp. ${parseFloat(product.margin50).toLocaleString(
                    "id-ID"
                  )}`}</td>
                  <td>{`Rp. ${parseFloat(product.margin60).toLocaleString(
                    "id-ID"
                  )}`}</td>
                  <td>{`Rp. ${parseFloat(product.margin70).toLocaleString(
                    "id-ID"
                  )}`}</td>
                  <td>{`Rp. ${parseFloat(product.margin80).toLocaleString(
                    "id-ID"
                  )}`}</td>
                  <td>{`Rp. ${parseFloat(product.margin90).toLocaleString(
                    "id-ID"
                  )}`}</td>
                  <td>{`Rp. ${parseFloat(product.margin100).toLocaleString(
                    "id-ID"
                  )}`}</td>
                  <td>
                    <button
                      className="edit-product-button"
                      onClick={() => handleEdit(product)}
                    >
                      Ubah
                    </button>
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
                <td colSpan="14">Tidak ada produk yang ditemukan</td>
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

export default ProductTable;
