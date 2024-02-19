import React, { useEffect, useState } from 'react';
import JSZip from 'jszip';
import './App.css';
import { Document, Page, pdfjs } from 'react-pdf';

// Set PDF.js worker URL
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    let interval;
    if (recording) {
      interval = setInterval(() => {
        setElapsedTime(prevElapsedTime => prevElapsedTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [recording]);


  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        setAudioChunks([e.data]);
      };
      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      setRecording(false);
      mediaRecorder.stop();
    }
  };

  useEffect(() => {
    const saveRecording = () => {
      if ((audioChunks.length > 0) && (recording === false)) {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');

        fetch('http://localhost:5000/transcribe-audio', {
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
            setPdfUrl(pdfUrl);
          })
          .catch(error => {
            console.error('Error processing PDF file:', error);
          });
      }
    };
    saveRecording();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioChunks])

  return (
    <div className='app'>
      <Timer time={elapsedTime} />
      <div className="button-container">
        <button onClick={recording ? stopRecording : startRecording} className={`button ${recording ? 'stop-button' : 'start-button'}`}>
          {recording ? 'Stop Recording and Upload' : 'Start Recording'}
        </button>
      </div>
      <div>
        {pdfUrl && (
          <Document
            file={pdfUrl}
            onLoadSuccess={({ numPages }) => {
              console.log(`Document loaded with ${numPages} pages`);
            }}
          >
            <Page pageNumber={1} width={800} />
          </Document>
        )}
      </div>
    </div>
  );
};

export default function App(props) {
  return (
    <div className='App'>
      <AudioRecorder />
    </div>
  );
}
