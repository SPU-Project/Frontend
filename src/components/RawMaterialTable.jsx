import React, { useState } from 'react';
import { Form, Button, Table, Container, Row, Col } from 'react-bootstrap';
import '../styles/RawMaterialTable.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const RawMaterialsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([
    { id: 1, bahanBaku: 'Cabe Merah', harga: 'Rp71.370,00' },
    { id: 2, bahanBaku: 'Garam', harga: 'Rp25.776,00' },
    { id: 3, bahanBaku: 'Cabe Keriting Merah', harga: 'Rp44.700,00' },
    { id: 4, bahanBaku: 'Ayam', harga: 'Rp35.500,00' },
    { id: 5, bahanBaku: 'Bawang Merah', harga: 'Rp42.163,00' },
  ]);

  const [formBahanBaku, setFormBahanBaku] = useState('');
  const [formHarga, setFormHarga] = useState('');
  const [editId, setEditId] = useState(null);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSimpan = (e) => {
    e.preventDefault();

    if (editId) {
      // Update data yang ada
      const updatedData = data.map(item =>
        item.id === editId
          ? { id: item.id, bahanBaku: formBahanBaku, harga: formHarga }
          : item
      );
      setData(updatedData);
      setEditId(null); // Reset editId setelah simpan
    } else {
      // Tambah data baru
      const newId = data.length ? data[data.length - 1].id + 1 : 1;
      const newData = { id: newId, bahanBaku: formBahanBaku, harga: formHarga };
      setData([...data, newData]);
    }

    // Reset form
    setFormBahanBaku('');
    setFormHarga('');
  };

  const handleUbah = (id) => {
    const itemToEdit = data.find(item => item.id === id);
    setFormBahanBaku(itemToEdit.bahanBaku);
    setFormHarga(itemToEdit.harga);
    setEditId(id);
  };

  const handleHapus = (id) => {
    const updatedData = data.filter(item => item.id !== id);
    setData(updatedData);
  };

  const filteredData = data.filter(item =>
    item.bahanBaku.toLowerCase().includes(searchTerm.toLowerCase())
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
            value={searchTerm} 
            onChange={handleSearchChange}
            className="search-input"
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
              <td>{item.bahanBaku}</td>
              <td>{item.harga}</td>
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
