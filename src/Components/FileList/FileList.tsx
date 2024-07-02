import React, { useState } from "react";
import "./FileList.css";
import FileElement from "./FileElement/FileElement";
import { useTranslation } from "react-i18next";
import ContextMenu from "../ContextMenu/ContextMenu";

interface FileListProps {
  files: File[];
  onSelectedChange: (file: File | null) => void;
  propagateDelete: (file: File, wasShown: boolean) => void;
  onRenameClick: (file: File) => void; 
}

const FileList: React.FC<FileListProps> = ({
  files,
  onSelectedChange,
  propagateDelete,
  onRenameClick,
}) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [contextMenuInfo, setContextMenuInfo] = useState<{
    mouseX: number;
    mouseY: number;
    file: File;
  } | null>(null);

  const handleSelectFile = (file: File | null) => {
    setSelectedFile(file);
    onSelectedChange(file);
  };

  const handleDelete = (file: File) => {
    if (selectedFile === file) {
      setSelectedFile(null);
      onSelectedChange(null);
    }
    propagateDelete(file, files[files.length - 1] === file);
  };

  const handleRightClick = (event: React.MouseEvent, file: File) => {
    event.preventDefault(); // Prevent the browser context menu from opening
    setContextMenuInfo({
      mouseX: event.clientX - 2, // Border offset
      mouseY: event.clientY - 4, // Border + padding offset
      file: file,
    });
  };

  const closeContextMenu = () => {
    setContextMenuInfo(null);
  };

  return (
    <div className={`file-list-container ${files.length === 0 ? "empty" : ""}`} onContextMenu={(e) => e.preventDefault()}>
      <div
        className="file-list"
        style={{
          position: "relative",
          height: "500px",
          overflowY: "auto",
        }}
      >
        <div className={`no-element ${files.length === 0 ? "active" : ""}`}>
          {t("fileListNoElement")}
        </div>
        {files.map((file: File, index: number) => (
          <FileElement
            key={index}
            file={file}
            position={index}
            onClick={() => handleSelectFile(file)}
            onDelete={() => handleDelete(file)}
            onContextMenu={(event) => handleRightClick(event, file)}
          />
        ))}
      </div>
      {contextMenuInfo && (
        <ContextMenu
          file={contextMenuInfo.file}
          onRenameClick={() => onRenameClick(contextMenuInfo.file)}
          mouseX={contextMenuInfo.mouseX}
          mouseY={contextMenuInfo.mouseY}
          onClose={closeContextMenu}
        />
      )}
    </div>
  );
};

export default FileList;