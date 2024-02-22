import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';
import './PatientReportPage.css';

const PatientReportPage = () => {
  // Sample patient records data
  const [loading, setLoading] = useState(true);
  const [patientRecords, setPatientRecords] = useState([]);
  const [pdfs, setPdfs] = useState('')

  const setPdfUrl = (base64String) => {
    const decodedData = atob(base64String);
    const binaryData = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; i++) {
      binaryData[i] = decodedData.charCodeAt(i);
    }
    const blob = new Blob([binaryData], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setPdfs(url)
  }

  const handleDownloadPDF = async (name, fileType) => {
    let response = await axios.post('https://dskvamshi1998.pythonanywhere.com/download_pdfs', {
      Folder_Name: name
    });
    if (fileType === 'admission_note') {
      setPdfUrl(response.data.pdf_files[0])
    } else {
      setPdfUrl(response.data.pdf_files[1])
    }
  };

  useEffect(() => {
    const patientData = JSON.parse(localStorage.getItem("patient_data"))['Folder_Names'];
    setPatientRecords(patientData)
    setLoading(false)
  }, [])
  return (
    <div>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
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
                <Button variant="primary" onClick={() => handleDownloadPDF(record.name, 'admission_note')}>
                  <FontAwesomeIcon icon={faFilePdf} className="pdf-icon" /> PDF 1
                </Button>
              </td>
              <td>
                <Button variant="primary" onClick={() => handleDownloadPDF(record.name, 'treatment_plan')}>
                  <FontAwesomeIcon icon={faFilePdf} className="pdf-icon" /> PDF 2
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {pdfs && <iframe
          title="PDF Viewer"
          src={pdfs}
          width="100%"
          height="500px"
          frameBorder="0"
        ></iframe>}
      </div>
    </div>
  );
};

export default PatientReportPage;
