import React, {useState, useEffect} from 'react';
import { getCookie } from './utils';
import Login from './components/pages/Login';
import LandingPage from './components/pages/LandingPage';

const App = () => {
  const [docId, setDocId] = useState(getCookie('doc_id'));

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDocId = getCookie('doc_id');
      if (currentDocId !== docId) {
        setDocId(currentDocId);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [docId]);

  return (
    <div className="App">
      {docId === null ? <Login /> : <LandingPage />}
    </div>

  );
}

export default App;
