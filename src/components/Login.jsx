import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './Login.css';

const Login = () => {
  return (
    <Container fluid className="login-container">
      <Row className="justify-content-center">
        <Col md="auto">
          <h1 className="login-heading">Sistem Produksi</h1>
          <p className="login-subheading">Masuk untuk melanjutkan</p>
          <div className="login-form">
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label className="form-label">E-mail</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>
              <Form.Group controlId="formBasicPassword" className="form-group-password">
                <Form.Label className="form-label">Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
              <Button variant="success" type="submit">
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