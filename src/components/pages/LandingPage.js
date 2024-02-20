import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navbar, Nav, Container, Row, Col, Form } from "react-bootstrap";
import { BsFillMicFill } from "react-icons/bs"; // Import the microphone icon
import "./LandingPage.css";

const HomePage = () => {
  const [userId, setUserId] = useState("");
  const [audioRecording, setAudioRecording] = useState(false);
  const [backendResponse, setBackendResponse] = useState("");
  const [patientRecords, setPatientRecords] = useState([]);

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (userId === "") {
      // Display error message if user id is empty
      return;
    }
  
    // Toggle audio recording state
    setAudioRecording(!audioRecording);
  
    // Set backend response based on recording status
    if (!audioRecording) {
      setBackendResponse("Recording started");
      setTimeout(() => {
        setBackendResponse("");
      }, 5000);
    } else {
      setBackendResponse("Recording ended");
    }
  };
  
  const loadPatientRecords = async () => {
    // Load patient records from backend API
    // const response = await axios.get('http://localhost:5000/patient-records');
    // setPatientRecords(response.data);
  };

  useEffect(() => {
    // Load patient records on page load
    loadPatientRecords();
  }, []);

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand style={{ marginLeft: "100px" }}>
          Swasthya Share
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home" style={{ marginLeft: "100px" }}>
              Home
            </Nav.Link>
            <Nav.Link href="#link" style={{ marginLeft: "100px" }}>
              About
            </Nav.Link>
            <Nav.Link href="#link" style={{ marginLeft: "100px" }}>
              Contact
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="#logout" style={{ marginLeft: "450px" }}>
              Log Out
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container fluid>
        <Row>
          <Col md={6} className="form-col">
            <div className="leftHalf">
              {/* Animate on hover */}
              <h3 className="recordConversation" id="recordTitle">
                Record Patient and Doctor Conversation
              </h3>
            </div>
            <Form onSubmit={handleUserSubmit} id="form">
              <Form.Group controlId="formBasicUserId">
                <Form.Label id="label">User ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter user ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </Form.Group>

              {/* Use microphone icon instead of button */}
              <BsFillMicFill
                id="micIcon"
                onClick={handleUserSubmit}
                style={{
                  marginTop: "40px",
                  cursor: "pointer",
                  fontSize: "15rem",
                  color: audioRecording ? "red" : "black",
                }}
              />
            </Form>
            {audioRecording && <p id="recordingMessage">Recording audio...</p>}
            {backendResponse && <p id="backendResponse">{backendResponse}</p>}
          </Col>
          <Col md={6}>
            <h2 id="patientRecordsTitle">Patient Records</h2>
            <ul id="patientRecordsList">
              {patientRecords.map((record) => (
                <li key={record.id}>{record.name}</li>
              ))}
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
