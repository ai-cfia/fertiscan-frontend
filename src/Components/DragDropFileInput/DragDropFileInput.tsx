import React, { useState, useRef, useEffect } from "react";
import "./DragDropFileInput.css";
interface FileInputProps {
  sendChange: (files: File[]) => void;
  file: string;
}

const DragDropFileInput: React.FC<FileInputProps> = ({ sendChange, file }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInput = useRef<null | HTMLInputElement>(null);
  useEffect(() => {
    if (file == "") {
      const input = fileInput!.current as HTMLInputElement;
      input.value = "";
    }
  }, [file]);
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
    const input = fileInput.current! as HTMLInputElement;
    input.click();
  };

  const handleFileChange = (files: File[]) => {
    if (files!.length > 0) {
      sendChange(files);
    }
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event!.target!.files!;
    handleFileChange(Array.from(files));
  };

  const handleCancel = () => {
    sendChange([]);
  };

  return (
    <div className="drag-drop-container">
      <h3 className="title">Attach a document</h3>
      <input
        id="file-input"
        ref={fileInput}
        type="file"
        multiple
        onChange={onFileChange}
      />
      <label
        htmlFor="file-input"
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`drag-drop-file-input ${dragActive ? "active" : ""} ${file ? "hasFile" : ""}`}
      >
        <embed id="preview" src={file} className={file ? "active" : ""}></embed>
      </label>
      <div className="drag-drop-inner">
        <p>Drag & drop your files here or</p>
        <button type="button" onClick={handleClick}>
          Browse Files
        </button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DragDropFileInput;
