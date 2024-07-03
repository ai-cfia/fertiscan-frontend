import React, { useState, useRef, useEffect } from "react";
import "./DragDropFileInput.css";
import { useTranslation } from "react-i18next";

interface FileInputProps {
  sendChange: (files: File[]) => void;
  file: string;
  calculateCaptureCounter: () => number;
}
const CAMERA_MODE = true;
const FILE_MODE = false;

const DragDropFileInput: React.FC<FileInputProps> = ({
  sendChange,
  file,
  calculateCaptureCounter,
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
  const [toggleMode, setToggleMode] = useState(false);
  const cameraSwitch = useRef<HTMLDivElement | null>(null);
  const [, setCaptureCounter] = useState<number>(1);

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
    if (toggleMode == CAMERA_MODE) {
      selectCamera();
    } else {
      setStream(null);
      stream?.getTracks().forEach((track) => track.stop());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleMode]);

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
        // Use the captureCounter state directly for naming the new file
        const captureCounter = calculateCaptureCounter();
        const file = new File([blob], `capture${captureCounter}.png`, {
          type: "image/png",
        });
        setCaptureCounter(captureCounter + 1); // Increment the captureCounter after use
        sendChange([file]); // Send the newly created file up to the parent component

        // Stop the camera stream and restart it if in CAMERA_MODE
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
          if (toggleMode === CAMERA_MODE) {
            selectCamera();
          }
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

  const handleCameraToggle = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setToggleMode(!toggleMode);
    if (toggleMode) {
      cameraSwitch.current!.classList.add("active");
    } else {
      cameraSwitch.current!.classList.remove("active");
    }
  };

  return (
    <div className="drag-drop-container">
      <h3 className="title">{t("dragAndDropFileH3")}</h3>

      <div className="entry-wrapper">
        <div
          className={`input-wrapper ${toggleMode == FILE_MODE ? "active" : ""}`}
        >
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
          className={`camera-container ${toggleMode == CAMERA_MODE ? "active" : ""}`}
        >
          <video
            id="player"
            ref={videoRef}
            autoPlay
            muted
            className="camera-feed"
          />
          <div className="camera-controls">
            <button id="capture" onClick={handleCapture} disabled={!stream}>
              {" "}
              {t("captureButton")}{" "}
            </button>
            <button onClick={toggleCameraMode}>
              {t("switchCameraButton")}
            </button>
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
          {toggleMode == FILE_MODE
            ? t("dragAndDropFilePOption1")
            : t("dragAndDropFilePOption2")}
        </p>
        <div
          className={`switch ${toggleMode ? "active" : ""}`}
          id="camera-switch"
          ref={cameraSwitch}
          onClick={handleCameraToggle}
        >
          <label>
            {t("fileSelectionLabel")}
            <input type="checkbox" />
            <span className="lever"></span>
            {t("cameraLabel")}
          </label>
        </div>
        <button type="button" onClick={selectFiles}>
          {" "}
          {t("browseFileButton")}
        </button>
      </div>
    </div>
  );
};

export default DragDropFileInput;
