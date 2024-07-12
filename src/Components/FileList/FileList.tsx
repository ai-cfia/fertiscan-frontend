import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import BlobData from "../../interfaces/BlobData";
import ContextMenu from "../ContextMenu/ContextMenu";
import FileElement from "./FileElement/FileElement";
import "./FileList.css";

interface FileListProps {
  blobs: BlobData[];
  onSelectedChange: (selected: BlobData | null) => void;
  propagateDelete: (deleted: BlobData, wasShown: boolean) => void;
  onRenameClick: (fileData: BlobData) => void; // Updated type definition
}

const FileList: React.FC<FileListProps> = ({
  blobs,
  onSelectedChange,
  propagateDelete,
  onRenameClick,
}) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<{
    blob: string;
    name: string;
  } | null>(null);
  const [contextMenuInfo, setContextMenuInfo] = useState<{
    mouseX: number;
    mouseY: number;
    fileData: BlobData; // Updated to accept BlobData
  } | null>(null);

  const handleSelectFile = (selected: BlobData | null) => {
    setSelectedFile(selected);
    onSelectedChange(selected);
  };

  const handleDelete = (deleted: BlobData) => {
    if (selectedFile === deleted) {
      setSelectedFile(null);
      propagateDelete(deleted, false);
    } else {
      propagateDelete(deleted, blobs[blobs.length - 1] === deleted);
    }
  };

  const handleRightClick = (event: React.MouseEvent, fileData: BlobData) => {
    event.preventDefault(); // Prevent the browser context menu from opening
    setContextMenuInfo({
      mouseX: event.clientX - 2, // Border offset
      mouseY: event.clientY - 4, // Border + padding offset
      fileData, // Store the blob data instead of file
    });
  };

  const closeContextMenu = () => {
    setContextMenuInfo(null);
  };

  return (
    <div
      className={`file-list-container ${blobs.length === 0 ? "empty" : ""}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        className={`file-list ${blobs.length === 0 ? "empty" : ""}`}
        style={{
          position: "relative",
          height: "500px",
          overflowY: "auto",
        }}
      >
        <div className={`no-element ${blobs.length === 0 ? "active" : ""}`}>
          {t("fileListNoElement")}
        </div>
        {[...blobs].map((blob: BlobData, index: number) => (
          <FileElement
            key={index}
            blob={blob} // Pass the actual blob string to the FileElement
            position={index}
            onClick={(selected) =>
              selected ? handleSelectFile(blob) : handleSelectFile(null)
            }
            onDelete={() => handleDelete(blob)}
            onContextMenu={(event) => handleRightClick(event, blob)}
          />
        ))}
      </div>
      {contextMenuInfo && (
        <ContextMenu
          fileData={contextMenuInfo.fileData} // Updated to fileData
          onRenameClick={onRenameClick} // Pass the original handler
          mouseX={contextMenuInfo.mouseX}
          mouseY={contextMenuInfo.mouseY}
          onClose={closeContextMenu}
        />
      )}
    </div>
  );
};

export default FileList;
