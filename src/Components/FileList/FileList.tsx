import React, { useState, useRef } from "react";
import "./FileList.css";
import FileElement from "./FileElement/FileElement";

interface FileListProps {
  files: File[];
}

const FileList: React.FC<FileListProps> = ({ files }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleSelectFile = (file: File, index: number) => {
    setSelectedFile(file);

    // Optionally, adjust overlay position based on selected image
    if (overlayRef.current) {
      const fileElement = document.getElementById(`file_${index}`);
      if (fileElement) {
        const { top, left } = fileElement.getBoundingClientRect();
        overlayRef.current.style.top = `${top}px`;
        overlayRef.current.style.left = `${left}px`;
      }
    }
  };

  return (
    <div className={`file-list ${files.length === 0 ? "empty" : ""}`}>
      <div className={`no-element ${files.length === 0 ? "active" : ""}`}>
        No element to show
      </div>
      {[...files].map((file: File, index: number, array: File[]) => (
        <FileElement
          key={index}
          file={file}
          position={index}
          onClick={() => handleSelectFile(file, index)}
        />
      ))}
      <div ref={overlayRef} className="overlay">
        {selectedFile && (
          <img
            src={URL.createObjectURL(selectedFile)}
            alt={selectedFile.name}
            style={{ maxWidth: "100%", maxHeight: "100%" }} // Adjust size as needed
          />
        )}
      </div>
    </div>
  );
};

export default FileList;
