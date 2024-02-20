import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css'; // Custom styles
import images from '../../img/logo.png'; // Assuming 'images.jpg' is in the same directory


const sha256 = require('js-sha256');

const hashString = (str) => {
  return sha256(str);
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            const encrypted_pwd = hashString(password)
            // const encryptedPassword = await encryptPassword(password); // Handle password encryption (see note below)
            const response = await axios.post('/api/login', { email, encrypted_pwd });

            if (response.data.success) {
                // Handle successful login (e.g., redirect to home page)
                console.log('Login successful!');

            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error(error);
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <Container fluid>
            <Row className="login-row">
                <Col xs={12} md={6} className="login-form-col">
                    <Form onSubmit={handleSubmit} className="login-form">
                        <h1 className="login-header">Login</h1>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => {setError('');setEmail(e.target.value)}}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => {setError('');setPassword(e.target.value)}}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="login-btn">
                            Login
                        </Button>
                        {error && <p className="text-danger">{error}</p>}
                    </Form>
                </Col>
                <Col xs={12} md={6} className="login-image-col">
                    {/* Add your company logo here */}
                    <img src={images} alt="Company logo" className="login-image" />

                    <p className="login-message">
                        <i>"Imagine a world where administrative tasks are a breeze, where medical records are just a click away, and accountability is never in question. With our streamlined approach, we're transforming the way healthcare operates, making every process smoother, every record more accessible, and every decision more informed. Welcome to a new era of efficiency and excellence in healthcare administration."</i>
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
