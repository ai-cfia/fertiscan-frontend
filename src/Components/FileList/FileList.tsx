import React, { useState } from "react";
import "./FileList.css";
import FileElement from "./FileElement/FileElement";
import { useTranslation } from "react-i18next";
import ContextMenu from "../ContextMenu/ContextMenu";

interface BlobData {
  blob: string;
  name: string;
}

interface FileListProps {
    blobs: { blob: string; name: string }[];
  onSelectedChange: (selected: { blob: string; name: string } | null) => void;
  propagateDelete: (
    deleted: { blob: string; name: string },
    wasShown: boolean,
  ) => void;
  onRenameClick: (fileData: BlobData) => void;  // Updated type definition
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
    fileData: BlobData;  // Updated to accept BlobData
  } | null>(null);

   const handleSelectFile = (
    selected: { blob: string; name: string } | null,
  ) => {
    setSelectedFile(selected);
    onSelectedChange(selected);
  };

  const handleDelete = (deleted: { blob: string; name: string }) => {
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
    <div className={`file-list-container ${blobs.length === 0 ? "empty" : ""}`} onContextMenu={(e) => e.preventDefault()}>
      <div
        className="file-list"
        style={{
          position: "relative",
          height: "500px",
          overflowY: "auto",
        }}
      >
        <div className={`no-element ${blobs.length === 0 ? "active" : ""}`}>
          {t("fileListNoElement")}
        </div>
        {[...blobs].map(
          (blob: { blob: string; name: string }, index: number) => (
          <FileElement
            key={index}
            blob={blob}  // Pass the actual blob string to the FileElement
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
          fileData={contextMenuInfo.fileData}  // Updated to fileData
          onRenameClick={onRenameClick}  // Pass the original handler
          mouseX={contextMenuInfo.mouseX}
          mouseY={contextMenuInfo.mouseY}
          onClose={closeContextMenu}
        />
      )}
    </div>
  );
};

export default FileList;