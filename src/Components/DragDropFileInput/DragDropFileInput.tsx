import React, { useState, useRef, useEffect } from "react";
import "./DragDropFileInput.css";
import { useTranslation } from "react-i18next";

interface FileInputProps {
  sendChange: (files: File[]) => void;
  file: string;
}
const CAMERA_MODE = true;
const FILE_MODE = false;

const DragDropFileInput: React.FC<FileInputProps> = ({ sendChange, file }) => {
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

  const handleFileChange = async (files: File[]) => {
    if (files.length > 0) {
      const processedFiles: File[] = [];

      for (const file of files) {
        await processImage(file, 400, 400, (newFile) => {
          processedFiles.push(newFile);
          if (processedFiles.length === files.length) {
            sendChange(processedFiles);
          }
        });
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
    if (canvasRef.current && videoRef.current && videoRef.current.videoWidth && videoRef.current.videoHeight) {
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;
  
      const context = canvasRef.current.getContext("2d");
  
      if (context) {
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
  
        // Dessiner la capture vidéo sur le canvas
        context.drawImage(
          videoRef.current,
          0,
          0,
          videoWidth,
          videoHeight
        ); 
  
      // Utilisez toDataURL pour convertir le canvas en une image codée en base64
      const capturedImage = canvasRef.current.toDataURL("image/png");
  
      processImageFromDataURL(capturedImage, 400, 400, (newFile) => {
          sendChange([newFile]);
        });
      }
     
    } else {
      console.error("Les éléments canvas ou vidéo ne sont pas correctement référencés, ou la vidéo n'est pas encore chargée.");
    }
  };

  function processImage(file: File, width: number, height: number, callback: (newFile: File) => void) {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;

        // Calculer la mise à l'échelle tout en préservant les proportions
        const scale = Math.min(width / img.width, height / img.height);
        const x = (width / 2) - (img.width / 2) * scale;
        const y = (height / 2) - (img.height / 2) * scale;
        if(ctx){
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        }
        // Convertir le canvas en fichier
        canvas.toBlob((blob) => {
          if(blob){
          const processedFile = new File([blob], file.name, { type: file.type });
          callback(processedFile);
          }
        }, "image/png");
      };
      if(event && event.target){
      img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  }

  function processImageFromDataURL(dataURL: string, width: number, height: number, callback: (newFile: File) => void) {
    const img = new Image();
    // Important pour le CORS si vous utilisez une image externe
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = width;
      canvas.height = height;
  
      // Calculer la mise à l'échelle pour maintenir les proportions
      const scale = Math.min(width / img.width, height / img.height);
      const x = (width - img.width * scale) / 2;
      const y = (height - img.height * scale) / 2;
      if(ctx){
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale); // Dessine l'image
      }
      canvas.toBlob((blob) => {
        if (blob !== null) {
          const newFile = new File([blob], 'capture.png', { type: 'image/png' });
          callback(newFile);
        }
      }, 'image/png');
    };
    img.src = dataURL;
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
