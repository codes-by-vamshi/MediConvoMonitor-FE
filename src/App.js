import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { getCookie } from './utils';
import Login from './components/pages/Login';
import LandingPage from './components/pages/LandingPage';
import PatientReportPage from './components/pages/PatientReportPage';

const App = () => {
  const docId = getCookie('doc_id');

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              docId === null ? <Login /> : <LandingPage />
            }
          />
          <Route path="/patientreport" element={<PatientReportPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
