import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Form } from "react-bootstrap";
import { BsFillMicFill } from "react-icons/bs";
import { getCookie, deleteCookie, setCookie } from '../../utils';
import "./LandingPage.css";
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const PatientRecord = ({ record }) => {
  const navigate = useNavigate();
  const viewDetailsClicked = async (patientId) => {
    try {
      let response = await axios.post('http://16.171.138.18/get_patient_info', {
        patient_id: patientId
      });
      localStorage.setItem("patient_data", JSON.stringify(response.data));
      setCookie('patient_id', patientId, 7)
      navigate('/patientreport')
    } catch (error) {
      return
    }
  }

  return (<div className="patient-record">
    <div style={{ width: '80%', paddingLeft: '5px' }}>
      <div style={{ textAlign: "left" }}>Patient Id: {record.patient_id}</div>
      <div style={{ textAlign: "left" }}>Patient Name: {record.patient_name}</div>
    </div>
    <div className="patient-details-btn" onClick={() => { viewDetailsClicked(record.patient_id) }}>View Details</div>
  </div>)
}

const Timer = ({ time }) => {
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer">
      Timer: {formatTime(time)}
    </div>
  );
};

const LandingPage = () => {
  const [patientId, setPatientId] = useState("");
  const [audioRecording, setAudioRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [backendResponse, setBackendResponse] = useState("");
  const [patientRecords, setPatientRecords] = useState([]);

  useEffect(() => {
    let interval;
    if (audioRecording) {
      interval = setInterval(() => {
        setElapsedTime(prevElapsedTime => prevElapsedTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [audioRecording]);

  const startRecording = async () => {
    if (patientId === "") {
      setBackendResponse("Add Patient Id");
      return;
    }
    try {
      const response = await axios.post('http://16.171.138.18/get_patient_info', {
        patient_id: patientId
      });
    } catch (error) {
      setBackendResponse("Invalid Patient Id")
      return
    }
    setBackendResponse("")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        setAudioChunks([e.data]);
      };
      recorder.start();
      setMediaRecorder(recorder);
      setAudioRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && audioRecording) {
      setAudioRecording(false);
      mediaRecorder.stop();
      setElapsedTime(0)
    }
  };

  useEffect(() => {
    const sendRecording = () => {
      if ((audioChunks.length > 0) && (audioRecording === false)) {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');

        fetch('http://16.171.138.18/transcribe-audio', {
          method: 'POST',
          body: formData,
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.blob();
          })
          .then(blob => {
            // Convert the PDF blob to a data URL
            const pdfUrl = URL.createObjectURL(blob);
          })
          .catch(error => {
            console.error('Error processing PDF file:', error);
          });
      }
    };
    sendRecording();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioChunks])

  const loadPatientRecords = async () => {
    const response = await axios.post('http://16.171.138.18/get_patients', {
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
      <div className="logout-btn" onClick={() => { deleteCookie('doc_id') }}>Log Out</div>
      <Container fluid>
        <Row>
          <Col md={6} className="form-col">
            <div className="leftHalf">
              {/* Animate on hover */}
              <h3 className="recordConversation" id="recordTitle">
                Record Patient and Doctor Conversation
              </h3>
            </div>
            <Form onSubmit={() => { audioRecording ? stopRecording() : startRecording() }} id="form">
              <Form.Group controlId="formBasicUserId">
                <Form.Label id="label">Patient ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter user ID"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                />
              </Form.Group>

              {/* Use microphone icon instead of button */}
              <BsFillMicFill
                id="micIcon"
                onClick={() => { audioRecording ? stopRecording() : startRecording() }}
                style={{
                  marginTop: "40px",
                  cursor: "pointer",
                  fontSize: "15rem",
                  color: audioRecording ? "red" : "black",
                }}
              />
            </Form>
            <Timer time={elapsedTime} />
            {audioRecording && <p id="recordingMessage">Recording audio...</p>}
            {backendResponse && <p id="backendResponse">{backendResponse}</p>}
          </Col>
          <Col md={6}>
            <h2 id="patientRecordsTitle">Patient Records</h2>
            <div className="patient-record-container">
              <ul id="patientRecordsList">
                {patientRecords.map((record) => (
                  <PatientRecord key={record.patient_id} record={record} />
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
