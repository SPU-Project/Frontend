import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import '../styles/LoginPage.css';

const Login = () => {
  const navigate = useNavigate(); // Inisialisasi useNavigate
  const [errorMessage, setErrorMessage] = useState(''); // State untuk menyimpan pesan error

  const handleLogin = (event) => {
    event.preventDefault(); // Menghentikan submit default
    
    const email = event.target.formBasicEmail.value;
    const password = event.target.formBasicPassword.value;

    if (!email || !password) {
      // Jika field email atau password kosong
      setErrorMessage('Email dan password harus diisi.');
      return; // Jangan lanjutkan jika form tidak lengkap
    }

    // Reset pesan error jika tidak ada masalah
    setErrorMessage('');

    // Logika autentikasi
    console.log("Login submitted!");

    // Setelah login sukses, arahkan ke ProductsPage
    navigate('/raw-materials'); // Atau path yang sesuai dengan rute ProductsPage
  };

  return (
    <Container fluid className="login-container login-body">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xs={10} sm={8} md="auto">
          <h1 className="login-heading text-center">Sistem Produksi</h1>
          <p className="login-subheading text-center">Masuk untuk melanjutkan</p>
          <div className="login-box mx-auto">
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label className="form-label">E-mail</Form.Label>
                <Form.Control type="email" placeholder="Enter email" required />
              </Form.Group>
              <Form.Group controlId="formBasicPassword" className="form-group-password">
                <Form.Label className="form-label">Password</Form.Label>
                <Form.Control type="password" placeholder="Password" required />
              </Form.Group>
              {errorMessage && (
                <p style={{ color: 'red', marginTop: '1rem' }}>{errorMessage}</p>
              )}
              <Button variant="success" type="submit" className="w-100">
                Masuk
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
