import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../../../features/auth/authApi';
import { authError, authStart, loginSuccess } from '../../../features/auth/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({
    userNameorEmail: '',
    password: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(authStart());

    try {
      const data = await login(formData);
      // console.log('Data from server:', data);
      // console.log('Token received from server:', data.token);
      dispatch(loginSuccess(data.token));
      toast.success('Login successful!');
      navigate('/admin/homepage');
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'An unexpected error occurred. Please try again.';
      dispatch(authError(errorMessage));
      toast.error(errorMessage);
      console.error('Login error:', err.response?.data || err);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='login-container py-5 mt-5'>
    <Container>
      <Row className='justify-content-center'>
        <Col md={6}>
          <h2 className='text-center text-white mb-4 mt-5'>Login Admin Page</h2>
          <Form onSubmit={handleSubmit} className="shadow-sm p-4 bg-dark text-white rounded">
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Username Or Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="enter username or email"
                value={formData.userNameorEmail}
                onChange={handleChange}
                name="userNameorEmail"
                // required
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <div style={{ position: 'relative' }}>
                <Form.Control
                  type={showPassword ? 'text' : 'password'} // Toggle input type
                  placeholder="enter password"
                  value={formData.password}
                  onChange={handleChange}
                  name="password"
                  // required
                />
                <Button
                  variant="outline-secondary"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)',
                  }}
                  onClick={toggleShowPassword}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              </div>
            </Form.Group>
            <div className="text-center">
            <Button variant="primary" type="submit" disabled={isLoading} className='mt-3'>
              {isLoading ? 'Logging in....' : 'Login'}
            </Button>
            </div>
            <div className="align-item">
             
              <p className="mb-0">
                Don't have an account?{' '}
                <Link to="/register" className="text-decoration-none text-info">
                  Register
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

export default Login;
