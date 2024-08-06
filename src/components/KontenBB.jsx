import React, { useState } from 'react';
import { Form, Button, Table, Container, Row, Col } from 'react-bootstrap';
import './KontenBB.css';  // Import CSS

const KontenBB = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Data bahan baku dummy
  const data = [
    { id: 1, bahanBaku: 'Cabe Merah', harga: 'Rp71.370,00' },
    { id: 2, bahanBaku: 'Garam', harga: 'Rp25.776,00' },
    { id: 3, bahanBaku: 'Cabe Keriting Merah', harga: 'Rp44.700,00' },
    { id: 4, bahanBaku: 'Ayam', harga: 'Rp35.500,00' },
    { id: 5, bahanBaku: 'Bawang Merah', harga: 'Rp42.163,00' },
  ];

  const filteredData = data.filter(item =>
    item.bahanBaku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Form>
        <Row>
          <Col xs={12} md={6}>
            <Form.Group controlId="formBahanBaku" className="form-group">
              <Form.Label className="text-form">Bahan Baku</Form.Label>
              <Form.Control type="text" placeholder="Enter Bahan Baku" />
            </Form.Group>
          </Col>
          </Row>
          <Row>
          <Col xs={12} md={6}>
            <Form.Group controlId="formHargaKilo" className="form-group">
              <Form.Label className="text-form">Harga/Kilo</Form.Label>
              <Form.Control type="text" placeholder="Enter Harga/Kilo" />
            </Form.Group>
          </Col>
        </Row>

        <Row className="button-search-group">
          <Col xs={12} md={6}>
            <Button variant="success" type="submit" className="button-group">
              Simpan
            </Button>
          </Col>
          <Col xs={12} md={6}>
            <Form.Control
              type="text"
              placeholder="Cari Bahan Baku"
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover responsive="sm" className="mt-4">
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
                <Button variant="primary" className="action-button">Ubah</Button>
                <Button variant="danger" className="action-button">Hapus</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default KontenBB;