import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navbar, Nav, Container, Row, Col, Form } from "react-bootstrap";
import { BsFillMicFill } from "react-icons/bs";
import { getCookie, deleteCookie } from '../../utils';
import "./LandingPage.css";

const PatientRecord = ({ record }) => {
  return (<div className="patient-record">
    <div style={{width: '80%', paddingLeft: '5px'}}>
      <div style={{textAlign: "left"}}>Patient Id: {record.patient_id}</div>
      <div style={{textAlign: "left"}}>Patient Name: {record.patient_name}</div>
    </div>
    <div className="patient-details-btn">View Details</div>
  </div>)
}

const LandingPage = () => {
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
    const response = await axios.post('http://localhost:5000/get_patient_details', {
      doctor_id: getCookie('doc_id')
    });
    setPatientRecords(response.data);
  };

  useEffect(() => {
    // Load patient records on page load
    loadPatientRecords();
  }, []);

  return (
    <div>
      <div className="logout-btn" onClick={()=>{deleteCookie('doc_id')}}>Log Out</div>
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
            <div className="patient-record-container">
              <h2 id="patientRecordsTitle">Patient Records</h2>
              <ul id="patientRecordsList">
                {patientRecords.map((record) => (
                  <PatientRecord record={record} />
                ))}
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LandingPage;
