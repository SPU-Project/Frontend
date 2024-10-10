import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBahanBaku,
  deleteBahanBaku,
  updateBahanBaku,
  addBahanBaku,
} from "../redux/bahanbakuslice";
import {
  Form,
  Modal,
  Button,
  Table,
  Container,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
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
  const [successMessage, setSuccessMessage] = useState(""); // For success messages
  const [loading, setLoading] = useState(false); // Loading state

  //Modal Efek Hapus
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  // Fetch data ketika komponen dimuat
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
        setErrorMessage(false);
      }, 3000);
      return;
    }

    // Validasi Bahan Baku
    if (!/^[a-zA-Z\s]+$/.test(formBahanBaku)) {
      setErrorMessage("Bahan baku harus diisi dengan huruf");
      setTimeout(() => {
        setErrorMessage(false);
      }, 3000);
      return;
    }

    // Validasi Harga
    if (isNaN(formHarga) || parseFloat(formHarga) < 0) {
      setErrorMessage("Harga hanya bisa diisi dengan Angka");
      setTimeout(() => {
        setErrorMessage(false);
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
        // Tidak perlu melakukan dispatch lagi
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
    <Container className="admin-table">
      <Form onSubmit={handleSimpan} className="form-container">
        <Row>
          <Col xs={12} md={6}>
            <Form.Group controlId="formBahanBaku" className="form-group">
              <Form.Label className="text-form">Bahan Baku</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Bahan Baku"
                value={formBahanBaku}
                onChange={(e) => setFormBahanBaku(e.target.value)}
                aria-label="Input Bahan Baku"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <Form.Group controlId="formHargaKilo" className="form-group">
              <Form.Label className="text-form">Harga/Kilo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Harga/Kilo"
                value={formHarga}
                onChange={(e) => setFormHarga(e.target.value)}
                aria-label="Input Harga per Kilo"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Tampilkan pesan error jika inputan kosong */}
        {errorMessage && (
          <Row>
            <Col>
              <p
                style={{
                  color: "red",
                  fontWeight: "bold",
                  animation: "fadeIn 0.5s",
                }}
              >
                {errorMessage}
              </p>
            </Col>
          </Row>
        )}

        {/* Tampilkan pesan sukses setelah update/tambah */}
        {successMessage && (
          <Row>
            <Col>
              <p
                style={{
                  color: "green",
                  fontWeight: "bold",
                  animation: "fadeIn 0.5s",
                }}
              >
                {successMessage}
              </p>
            </Col>
          </Row>
        )}

        <Row className="button-search-group">
          <Col xs={12} md={6}>
            <Button variant="success" type="submit" className="button-group">
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Loading...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </Col>
        </Row>
      </Form>

      <div className="table-controls">
        <div className="search-container-raw">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Cari Bahan Baku"
            className="search-input-raw"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Cari Bahan Baku"
          />
        </div>
      </div>

      <Table striped bordered hover responsive="sm" className="admin-table">
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
                <Button
                  variant="primary"
                  className="action-button"
                  onClick={() => handleUbah(item.id)}
                >
                  Ubah
                </Button>
                <Button
                  variant="danger"
                  className="action-button"
                  onClick={() => handleHapus(item.id)}
                  style={{ marginLeft: "10px" }}
                >
                  Hapus
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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
    </Container>
  );
};

export default RawMaterialsTable;
