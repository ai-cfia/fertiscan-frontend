import React, { useState } from "react";
import "./FileList.css";
import FileElement from "./FileElement/FileElement";
import { useTranslation } from "react-i18next";

interface FileListProps {
  blobs: {blob: string, name: string}[];
  onSelectedChange: (selected: {blob:string,name:string} | null) => void;
  propagateDelete: (deleted: {blob:string,name:string}, wasShown: boolean) => void;
}

const FileList: React.FC<FileListProps> = ({
  blobs,
  onSelectedChange,
  propagateDelete,
}) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<{blob:string,name:string} | null>(null);

  const handleSelectFile = (selected: {blob:string, name:string} | null) => {
    setSelectedFile(selected);
    onSelectedChange(selected);
  };

  const handleDelete = (deleted: {blob:string,name:string}) => {
    if (selectedFile === deleted) {
      setSelectedFile(null);
      propagateDelete(deleted, false);
    } else {
      propagateDelete(deleted, blobs[blobs.length - 1] ===  deleted);
    }
  };

  return (
    <div className={`file-list-container ${blobs.length === 0 ? "empty" : ""}`}>
      <div
        className="file-list"
        style={{
          position: "relative",
          height: "500px", // Adjust this value to the original container height
          overflowY: "auto",
        }}
      >
        <div className={`no-element ${blobs.length === 0 ? "active" : ""}`}>
          {t("fileListNoElement")}
        </div>
        {[...blobs].map((blob: {blob:string,name:string}, index: number) => (
          <FileElement
            key={index}
            blob={blob}
            position={index}
            onClick={(selected) =>
              selected ? handleSelectFile(blob) : handleSelectFile(null)
            }
            onDelete={() => handleDelete(blob)}
          />
        ))}
      </div>
    </div>
  );
};

export default FileList;
