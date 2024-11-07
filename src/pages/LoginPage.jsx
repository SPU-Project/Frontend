import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "../styles/LoginPage.css";
import { useDispatch } from "react-redux";
import { loginUser, fetchUser } from "../redux/userSlice"; // Import loginUser action dari Redux slice

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    const email = event.target.formBasicEmail.value;
    const password = event.target.formBasicPassword.value;

    if (!email || !password) {
      setErrorMessage("Email dan password harus diisi.");
      return;
    }

    setErrorMessage("");

    try {
      await dispatch(loginUser({ email, password })).unwrap();

      // Fetch user data again after login to update Redux store
      const user = await dispatch(fetchUser()).unwrap();

      // Fetch user data again after login to update Redux state
      await dispatch(fetchUser()).unwrap();

      navigate("/raw-materials");
    } catch (error) {
      setErrorMessage(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <Container fluid className="login-container login-body">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xs={10} sm={8} md="auto">
          <h1 className="login-heading text-center">Sistem Produksi</h1>
          <p className="login-subheading text-center">
            Masuk untuk melanjutkan
          </p>
          <div className="login-box mx-auto">
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label className="form-label">E-mail</Form.Label>
                <Form.Control type="email" placeholder="Enter email" required />
              </Form.Group>
              <Form.Group
                controlId="formBasicPassword"
                className="form-group-password"
              >
                <Form.Label className="form-label">Password</Form.Label>
                <Form.Control type="password" placeholder="Password" required />
              </Form.Group>
              {errorMessage && (
                <p style={{ color: "red", marginTop: "1rem" }}>
                  {errorMessage}
                </p>
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
