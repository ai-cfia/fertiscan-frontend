import React, { useState } from "react";
import "./FileList.css";
import FileElement from "./FileElement/FileElement";

interface FileListProps {
  files: File[];
  onSelectedChange: (file: File | null) => void;
  propagateDelete: (file: File, wasShown: boolean) => void;
}

const FileList: React.FC<FileListProps> = ({
  files,
  onSelectedChange,
  propagateDelete,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSelectFile = (file: File | null) => {
    setSelectedFile(file);
    onSelectedChange(file);
  };

  const handleDelete = (file: File) => {
    if (selectedFile === file) {
      setSelectedFile(null);
      propagateDelete(file, false);
    } else {
      propagateDelete(file, files[files.length - 1] === file);
    }
  };

  return (
    <div className={`file-list ${files.length === 0 ? "empty" : ""}`}>
      <div className={`no-element ${files.length === 0 ? "active" : ""}`}>
        No element to show
      </div>
      {[...files].map((file: File, index: number) => (
        <FileElement
          key={index}
          file={file}
          position={index}
          onClick={(selected) =>
            selected ? handleSelectFile(file) : handleSelectFile(null)
          }
          onDelete={() => handleDelete(file)}
        />
      ))}
    </div>
  );
};

export default FileList;
