import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-regular-svg-icons";
import "./PatientReportPage.css";

const PatientReportPage = () => {
  const [loading, setLoading] = useState(true);
  const [patientRecords, setPatientRecords] = useState([]);
  const [pdfs, setPdfs] = useState("");

  const setPdfUrl = (base64String) => {
    const decodedData = atob(base64String);
    const binaryData = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; i++) {
      binaryData[i] = decodedData.charCodeAt(i);
    }
    const blob = new Blob([binaryData], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setPdfs(url);
  };

  const handleDownloadPDF = async (name, fileType) => {
    setLoading(true); // Set loading to true on button click
    try {
      let response = await axios.post("http://16.171.138.18/download_pdfs", {
        Folder_Name: name,
      });
      if (fileType === "admission_note") {
        setPdfUrl(response.data.pdf_files[0]);
      } else {
        setPdfUrl(response.data.pdf_files[1]);
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
    } finally {
      setLoading(false); // Set loading to false after the response is received
    }
  };

  useEffect(() => {
    const patientData = JSON.parse(localStorage.getItem("patient_data"))[
      "Folder_Names"
    ];
    setPatientRecords(patientData);
    setLoading(false);
  }, []);

  return (
    <div>
      {loading && (
        <div className="loading-overlay">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )}
      <h2 id="patient-records">Patient Records</h2>
      <table id="patient-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Admission Note</th>
            <th>Treatment Plan</th>
          </tr>
        </thead>
        <tbody>
          {patientRecords.map((record, index) => (
            <tr key={index}>
              <td>{record.date}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() =>
                    handleDownloadPDF(record.name, "admission_note")
                  }
                >
                  <FontAwesomeIcon icon={faFilePdf} className="pdf-icon" /> PDF
                  1
                </Button>
              </td>
              <td>
                <Button
                  variant="danger"
                  onClick={() =>
                    handleDownloadPDF(record.name, "treatment_plan")
                  }
                >
                  <FontAwesomeIcon icon={faFilePdf} className="pdf-icon" /> PDF
                  2
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {pdfs && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <iframe
            title="PDF Viewer"
            src={pdfs}
            width="80%"
            height="500px"
            frameBorder="0"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default PatientReportPage;
