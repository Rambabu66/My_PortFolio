import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register } from "../../../features/auth/authApi";
import {
  authError,
  authStart,
  registerSuccess,
} from "../../../features/auth/authSlice";

const Register = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    dispatch(authStart());

    try {
      const data = await register(formData);
      dispatch(registerSuccess());
      toast.success(data.message || "Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred. Please try again.";
      dispatch(authError(errorMessage));
      toast.error(errorMessage);
      console.error("Registration error:", err.response?.data || err);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  return (
    <div className="login-container py-5 mt-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <h2 className="text-center text-white mb-4 mt-5">Register Page</h2>
            <Form
              onSubmit={handleSubmit}
              className="shadow-sm p-4 bg-dark text-white rounded"
            >
              <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={formData.userName}
                  onChange={handleChange}
                  name="userName"
                  //   required
                />
              </Form.Group>

              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                  //   required
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <div style={{ position: "relative" }}>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    name="password"
                    // required
                  />
                  <Button
                    variant="outline-secondary"
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "10px",
                      transform: "translateY(-50%)",
                    }}
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </div>
              </Form.Group>

              <Form.Group controlId="formBasicConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <div style={{ position: "relative" }}>
                  <Form.Control
                    type={showConfirmPassword? "text" : "password"}
                    placeholder="Enter Confirmpassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    name="confirmPassword"
                    // required
                  />
                  <Button
                    variant="outline-secondary"
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "10px",
                      transform: "translateY(-50%)",
                    }}
                    onClick={toggleShowConfirmPassword }
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </Button>
                </div>
              </Form.Group>

              <div className="text-center">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isLoading}
                  className="mt-3"
                >
                  {isLoading ? "Registering..." : "Register"}
                </Button>
              </div>

              <div className="text-center mt-3">
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="text-decoration-none text-info">
                    Login
                  </Link>
                </p>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
