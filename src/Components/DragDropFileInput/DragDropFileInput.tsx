import React, { useState, useRef, useEffect } from "react";
import "./DragDropFileInput.css";

interface FileInputProps {
  sendChange: (files: File[]) => void;
  file: string;
}

const DragDropFileInput: React.FC<FileInputProps> = ({ sendChange, file }) => {
  const [dragActive, setDragActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [cameraMode, setCameraMode] = useState<"environment" | "user">("environment");
  const fileInput = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (file === "") {
      const input = fileInput!.current!;
      input.value = "";
    }
  }, [file]);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const handleDrag = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    setDragActive(false);
    const files = event.dataTransfer?.files;
    if (files) {
      handleFileChange(Array.from(files));
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setShowOptions(true);
    setShowOverlay(true);
  };

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      sendChange(files);
    }
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFileChange(Array.from(files));
    }
  };

  const handleCancel = () => {
    sendChange([]);
    setCapturedImage(null);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowModal(false);
    setShowOverlay(false);
  };

  const handleCapture = async () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const capturedImage = canvasRef.current.toDataURL("image/png");
        setCapturedImage(capturedImage);
        const blob = await fetch(capturedImage).then((res) => res.blob());
        const file = new File([blob], "capture.png", { type: "image/png" });
        sendChange([file]);
        setShowOptions(false);
        setShowModal(false);
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
        }
      }
    }
    setShowOverlay(false);
  };

  const selectFiles = () => {
    const input = fileInput.current!;
    input.click();
    setShowOptions(false);
    setShowOverlay(false);
  };

  const selectCamera = async () => {
    setShowOptions(false);
    setShowModal(true);
    setShowOverlay(true);
    try {
      const constraints = { video: { facingMode: cameraMode } };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const toggleCameraMode = () => {
    setCameraMode(prevMode => prevMode === "environment" ? "user" : "environment");
  };

  const toggleOverlay = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setShowOverlay(!showOverlay);
  };

  return (
    <div className="drag-drop-container">
      <h3 className="title">Attach a document</h3>
      <input id="file-input" ref={fileInput} type="file" multiple onChange={onFileChange} style={{ display: "none" }} />
      <label htmlFor="file-input" onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop} onClick={handleClick} className={`drag-drop-file-input ${dragActive ? "active" : ""} ${file ? "hasFile" : ""}`} >
        <embed id="preview" src={file} className={file ? "active" : ""} />
      </label>
      <div className="drag-drop-inner">
        <p>Drag & drop your files here or</p>
        <button type="button" onClick={handleClick}> Browse Files or Camera </button>
        <button type="button" onClick={handleCancel}> Cancel </button>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCancel}>&times;</span>
            <div className="camera-container">
              <video id="player" ref={videoRef} autoPlay muted style={{ width: '320px', height: '240px' }} />
              <div className="camera-controls">
                <button id="capture" onClick={handleCapture} disabled={!stream}> Capture </button>
                <button onClick={toggleCameraMode}>Switch Camera</button>
              </div>
              <canvas id="canvas" ref={canvasRef} width="320" height="240" style={{ display: 'none' }} />
            </div>
          </div>
        </div>
      )}
      {showOptions && (
        <div className="modal">
          <div className="option-modal-content">
            <span className="close" onClick={handleCancel}>&times;</span>
            <div className="centered-buttons">
              <button type="button" onClick={selectFiles}> Choose Files </button>
              <button type="button" onClick={selectCamera}> Use Camera </button>
            </div>
          </div>
        </div>
      )}
      {showOverlay && <div className="overlay" onClick={toggleOverlay}></div>}
    </div>
  );
};

export default DragDropFileInput;
