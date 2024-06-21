import React, { useState, useRef, useEffect } from "react";
import "./DragDropFileInput.css";
import { useTranslation } from 'react-i18next';

interface FileInputProps {
  sendChange: (files: File[]) => void;
  file: string;
  mode: boolean;
}
const CAMERA_MODE = true;
const FILE_MODE = false;

const DragDropFileInput: React.FC<FileInputProps> = ({
  sendChange,
  file,
  mode,
}) => {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraMode, setCameraMode] = useState<"environment" | "user">(
    "environment",
  );
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

  useEffect(() => {
    if (mode == CAMERA_MODE) {
      selectCamera();
    } else {
      setStream(null);
      stream?.getTracks().forEach((track) => track.stop());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    selectCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraMode]);

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
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleCapture = async () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height,
        );
        const capturedImage = canvasRef.current.toDataURL("image/png");
        const blob = await fetch(capturedImage).then((res) => res.blob());
        const file = new File([blob], "capture.png", { type: "image/png" });
        sendChange([file]);
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);

          selectCamera();
        }
      }
    }
  };

  const selectFiles = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const input = fileInput.current!;
    input.click();
  };

  const selectCamera = async () => {
    try {
      const constraints = { video: { facingMode: { exact: cameraMode } } };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const toggleCameraMode = () => {
    setCameraMode((prevmode) =>
      prevmode === "environment" ? "user" : "environment",
    );
  };

  return (
    <div className="drag-drop-container">
      <h3 className="title">{t("dragAndDropFileH3")}</h3>

      <div className="entry-wrapper">
        <div className={`input-wrapper ${mode == FILE_MODE ? "active" : ""}`}>
          <input
            id="file-input"
            ref={fileInput}
            type="file"
            multiple
            onChange={onFileChange}
            style={{ display: "none" }}
          />
          <label
            htmlFor="file-input"
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={selectFiles}
            className={`drag-drop-file-input ${dragActive ? "active" : ""} ${file ? "hasFile" : ""}`}
          >
            <embed id="preview" src={file} className={file ? "active" : ""} />
          </label>
        </div>

        <div
          className={`camera-container ${mode == CAMERA_MODE ? "active" : ""}`}
        >
          <video
            id="player"
            ref={videoRef}
            autoPlay
            muted
            style={{ width: "320px", height: "240px" }}
          />
          <div className="camera-controls">
            <button id="capture" onClick={handleCapture} disabled={!stream}>
              {" "}
              {t("captureButton")}{" "}
            </button>
            <button onClick={toggleCameraMode}>{t("switchCameraButton")}</button>
          </div>
          <canvas
            id="canvas"
            ref={canvasRef}
            width="320"
            height="240"
            style={{ display: "none" }}
          />
        </div>
      </div>
      <div className="drag-drop-inner">
        <p>
          {mode == FILE_MODE
            ? "Drag & drop your files here or"
            : "Take a picture or"}
        </p>
        <button type="button" onClick={selectFiles}>
          {" "}
          {t("browseFileButton")}
        </button>
        <button type="button" onClick={handleCancel}>
          {" "}
          {t("cancelButton")}{" "}
        </button>
      </div>
    </div>
  );
};

export default DragDropFileInput;
