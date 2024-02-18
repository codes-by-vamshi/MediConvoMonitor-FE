import React, { useState, useEffect } from 'react';
import './App.css';
import JSZip from 'jszip';

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

const StartButton = ({ onClick, isRecording }) => {
  return (
    <button onClick={onClick} className={`button ${isRecording ? 'recording' : ''}`}>
      {isRecording ? 'Recording...' : 'Start Recording'}
    </button>
  );
};

const EndButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="button end-button">
      End Recording and Upload
    </button>
  );
};

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [pdfLinks, setPdfLinks] = useState([]);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setElapsedTime(prevElapsedTime => prevElapsedTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRecording]);
  
  const startRecording = async () => {
    setIsRecording(true);
  
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
  
      const recordedChunks = []; // Array to store recorded audio chunks
  
      // Event listener to capture data available from mediaRecorder
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data); // Append new chunk to the array
        }
      });
  
      mediaRecorder.start(); // Start recording
      setMediaRecorder(mediaRecorder); // Update mediaRecorder state
  
      // Event listener to handle recording stop
      mediaRecorder.addEventListener('stop', () => {
        setIsRecording(false); // Update recording state
        setChunks(recordedChunks); // Update chunks state with recorded chunks
      });
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };
  

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  };

  const resetTimer = () => {
    setElapsedTime(0);
  };

  const handleRecordingStopped = () => {
    endRecordingAndUpload();
  };

  useEffect(() => {
    if (mediaRecorder) {
      mediaRecorder.addEventListener('stop', handleRecordingStopped);
    }

    return () => {
      if (mediaRecorder) {
        mediaRecorder.removeEventListener('stop', handleRecordingStopped);
      }
    };
  }, [mediaRecorder]);

  const endRecordingAndUpload = async () => {
    stopRecording();
    console.log('Recorded audio chunks:', chunks);
    console.log('Recorded audio chunks[0]:', chunks[0]);

  
    try {
      const response = await fetch('https://dskvamshi1998.pythonanywhere.com/transcribe-audio', {
        method: 'POST',
        body: chunks[0],
      });
  
      if (response.ok) {
        console.log('Audio transcription successful:', response.statusText);
  
        const zipFile = await response.blob();
        const zipFileUrl = window.URL.createObjectURL(zipFile);
  
        const zipContentResponse = await fetch(zipFileUrl);
        const zipContentBlob = await zipContentResponse.blob();
  
        const zip = new JSZip();
        await zip.loadAsync(zipContentBlob);
  
        const pdfFileNames = Object.keys(zip.files).filter(fileName => fileName.endsWith('.pdf'));
        const pdfLinks = pdfFileNames.map(fileName => {
          const pdfBlob = zip.file(fileName).async('blob');
          const pdfUrl = window.URL.createObjectURL(pdfBlob);
          return (
            <div key={fileName}>
              <a href={pdfUrl} target="_blank">{fileName}</a>
            </div>
          );
        });
  
        setPdfLinks(pdfLinks);
  
        window.URL.revokeObjectURL(zipFileUrl);
      } else {
        console.error('Failed to transcribe audio:', response.statusText);
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
    }
  };
  

  return (
    <div className="app">
      <Timer time={elapsedTime} />
      <div className="button-container">
        {isRecording ? (
          <button onClick={stopRecording} className="button stop-button">Stop Recording</button>
        ) : (
          <StartButton onClick={startRecording} isRecording={isRecording} />
        )}
        <EndButton onClick={endRecordingAndUpload} />
        <button onClick={resetTimer} className="button reset-button">Reset Timer</button>
      </div>
      <div className="pdf-links">
        {pdfLinks.map((link, index) => (
          <div key={index}>{link}</div>
        ))}
      </div>
    </div>
  );
};

export default App;
