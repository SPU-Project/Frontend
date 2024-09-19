import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBahanBaku,
  deleteBahanBaku,
  updateBahanBaku,
  addBahanBaku,
} from "../redux/bahanbakuslice";
import { Form, Button, Table, Container, Row, Col } from "react-bootstrap";
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

  // Fetch data ketika komponen dimuat
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBahanBaku());
    }
  }, [dispatch, status]);

  // Fungsi untuk menyimpan data baru atau memperbarui data yang ada
  const handleSimpan = (e) => {
    e.preventDefault();
    console.log("Form Bahan Baku: ", formBahanBaku);
    console.log("Form Harga: ", formHarga);

    if (editId) {
      // Jika ada id yang diedit, lakukan update
      dispatch(
        updateBahanBaku({
          id: editId,
          BahanBaku: formBahanBaku,
          Harga: formHarga,
        })
      );
      setEditId(null); // Reset editId setelah menyimpan
    } else {
      // Jika tidak ada editId, tambahkan data baru
      dispatch(
        addBahanBaku({
          BahanBaku: formBahanBaku,
          Harga: formHarga,
        })
      )
        .unwrap()
        .then(() => {
          dispatch(fetchBahanBaku()); // Fetch ulang data setelah tambah data
        });
    }

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

  // Fungsi untuk menghapus data
  const handleHapus = (id) => {
    dispatch(deleteBahanBaku(id));
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
                placeholder="Masukan Bahan Baku"
                value={formBahanBaku}
                onChange={(e) => setFormBahanBaku(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <Form.Group controlId="formHargaKilo" className="form-group">
              <Form.Label className="text-form">Harga</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukan Harga/kg"
                value={formHarga}
                onChange={(e) => setFormHarga(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="button-search-group">
          <Col xs={12} md={6}>
            <Button variant="success" type="submit" className="button-group">
              Simpan
            </Button>
          </Col>
        </Row>
      </Form>

      <div className="table-controls">
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Cari Bahan Baku"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
    </Container>
  );
};

export default RawMaterialsTable;
