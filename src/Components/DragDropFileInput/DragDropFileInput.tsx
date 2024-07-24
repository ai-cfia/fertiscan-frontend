import React, { useState, useRef, useEffect } from "react";
import "./DragDropFileInput.css";
import { useTranslation } from "react-i18next";
import { useAlert } from "../../Utils/AlertContext";

interface FileInputProps {
  sendChange: (files: File[]) => void;
  file: string;
  calculateCaptureCounter: () => number;
}

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
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [, setCaptureCounter] = useState<number>(1);
  const { showAlert } = useAlert();
  const CAMERA_MODE = true;
  const FILE_MODE = false;

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

  const handleFileChange = async (files: File[]) => {
    const imageTypes = ["image/png", "image/jpeg", "image/jpg", "image/heif"]; // Accept file extention
    const processedFiles: File[] = [];
    if (files.length > 0) {
      for (const file of files) {
        if (!imageTypes.includes(file.type)) {
          console.log(t("invalidImageTypeAlert") + ": " + file.name);
          showAlert(t("invalidImageTypeAlert") + ": " + file.name, "error");
        } else {
          await processImage(file, 900, 900, (newFile) => {
            processedFiles.push(newFile);
            if (processedFiles.length === files.length) {
              sendChange(processedFiles);
            }
          });
        }
      }
    }
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target?.files;
    if (files && event.target) {
      handleFileChange(Array.from(files));
    }
  };

  const handleCapture = async () => {
    if (
      canvasRef.current &&
      videoRef.current &&
      videoRef.current.videoWidth &&
      videoRef.current.videoHeight
    ) {
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;

      const context = canvasRef.current.getContext("2d");

      if (context) {
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
        const capturedImage = canvasRef.current.toDataURL("image/png");

        processImageFromDataURL(capturedImage, 400, 400, (newFile) => {
          sendChange([newFile]); // Send the newly created file up to the parent component
        });
        // Stop the camera stream and restart it if in CAMERA_MODE
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
          if (toggleMode === CAMERA_MODE) {
            selectCamera();
          }
        }
      }
    } else {
      console.error(
        "Les éléments canvas ou vidéo ne sont pas correctement référencés, ou la vidéo n'est pas encore chargée.",
      );
    }
  };

  function processImage(
    file: File,
    width: number,
    height: number,
    callback: (newFile: File) => void,
  ) {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        const scale = Math.min(width / img.width, height / img.height);
        const x = width / 2 - (img.width / 2) * scale;
        const y = height / 2 - (img.height / 2) * scale;
        if (ctx) {
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        }
        canvas.toBlob((blob) => {
          if (blob) {
            const processedFile = new File([blob], file.name, {
              type: file.type,
            });
            callback(processedFile);
          }
        }, "image/png");
      };
      if (event && event.target) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  }

  function processImageFromDataURL(
    dataURL: string,
    width: number,
    height: number,
    callback: (newFile: File) => void,
  ) {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = width;
      canvas.height = height;
      const scale = Math.min(width / img.width, height / img.height);
      const x = (width - img.width * scale) / 2;
      const y = (height - img.height * scale) / 2;
      if (ctx) {
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      }
      canvas.toBlob((blob) => {
        if (blob !== null) {
          const captureCounter = calculateCaptureCounter();
          const newFile = new File([blob], `capture${captureCounter}.png`, {
            type: "image/png",
          });
          setCaptureCounter(captureCounter + 1);
          callback(newFile);
        }
      }, "image/png");
    };
    img.src = dataURL;
  }

  const selectFiles = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const input = fileInput.current!;
    input.click();
  };

  // This function gets the camera permission status
  const getCameraPermission = async () => {
    try {
      setHasPermission(
        (await navigator.mediaDevices.getUserMedia({ video: true }))
          ? true
          : false,
      );
    } catch (err) {
      setHasPermission(false);
    }
  };

  const selectCamera = async () => {
    if (hasPermission === null) {
      await getCameraPermission();
      if (!hasPermission) return;
    } else if (!hasPermission) {
      return;
    }

    const constraints = { video: { facingMode: { exact: cameraMode } } };
    const newStream = await navigator.mediaDevices.getUserMedia(constraints);
    setStream(newStream);
  };

  const toggleCameraMode = () => {
    setCameraMode((prevmode) =>
      prevmode === "environment" ? "user" : "environment",
    );
  };

  const handleCameraToggle = async (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    getCameraPermission();
    if (!hasPermission) {
      showAlert(t("cameraPermissionError"), "error");
      return;
    }
    setToggleMode((currentMode) => !currentMode);
  };

  // Check camera permissions when the component mounts
  useEffect(() => {
    getCameraPermission();
  }, []);

  useEffect(() => {
    if (toggleMode && cameraSwitch.current) {
      cameraSwitch.current.classList.add("active");
    } else if (cameraSwitch.current) {
      cameraSwitch.current.classList.remove("active");
    }
  }, [toggleMode]);

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

  return (
    <div className="drag-drop-container">
      <div className="entry-wrapper">
        <div
          className={`input-wrapper ${toggleMode == FILE_MODE ? "active" : ""}`}
        >
          <input
            id="file-input"
            ref={fileInput}
            type="file"
            accept="image/*"
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
            <p className={file ? "hasFile" : ""}>
              {t("AccessFile")}
              <br />
              {t("dragAndDropFilePOption1")}
            </p>
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
      </div>
    </div>
  );
};

export default DragDropFileInput;
