import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';
import './PatientReportPage.css';

const PatientReportPage = () => {
  // Sample patient records data
  const [loading, setLoading] = useState(true);
  const [patientRecords, setPatientRecords] = useState([]);

  const handleDownloadPDF = (pdfName) => {
    // Logic to download PDF
    console.log('Downloading PDF:', pdfName);
  };

  // Simulate loading delay
  setTimeout(() => {
    setPatientRecords([
      { date: '2024-02-21', pdf1: 'pdf1.pdf', pdf2: 'pdf2.pdf' },
      // Add more patient records as needed
    ]);
    setLoading(false);
  }, 2000);

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
            <th>Transciption Report</th>
            <th>Progress Report</th>
          </tr>
        </thead>
        <tbody>
          {patientRecords.map((record, index) => (
            <tr key={index}>
              <td>{record.date}</td>
              <td>
                <Button variant="primary" onClick={() => handleDownloadPDF(record.pdf1)}>
                  <FontAwesomeIcon icon={faFilePdf} className="pdf-icon" /> PDF 1
                </Button>
              </td>
              <td>
                <Button variant="primary" onClick={() => handleDownloadPDF(record.pdf2)}>
                  <FontAwesomeIcon icon={faFilePdf} className="pdf-icon" /> PDF 2
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientReportPage;
