import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';
import Header from './HeaderBB';
import KontenBB from './KontenBB';
import './BahanBaku.css';

const BahanBakuPage = () => {
  return (
    <div className="bahan-baku-page">
      <Container fluid>
        <Row>
          <Col xs={2} id="sidebar-wrapper">
            <Sidebar />
          </Col>
          <Col xs={10} id="page-content-wrapper">
            <div className="header-wrapper">
              <Header />
            </div>
            <KontenBB />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BahanBakuPage;