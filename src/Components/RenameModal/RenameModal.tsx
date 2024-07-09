import React, { useEffect, useState } from "react";
import "../Modal/Modal.css";
import { useTranslation } from "react-i18next";

interface BlobData {
  blob: string;
  name: string;
}

interface RenameModalProps {
  fileData: BlobData; // Updated to handle BlobData
  handleRename: (updatedFileData: BlobData) => void; // Updated type signature
  close: () => void;
  updateNewFileName: (newName: string) => void;
}

const RenameModal: React.FC<RenameModalProps> = ({
  fileData,
  handleRename,
  close,
}) => {
  const { t } = useTranslation();
  const [nameWithoutExtension, extension] =
    // eslint-disable-next-line
    fileData.name.split(/\.(?=[^\.]+$)/);
  const [newFileName, setNewFileName] = useState<string | undefined>(undefined);
  useEffect(() => {
    setNewFileName(nameWithoutExtension);
  }, [fileData.name, nameWithoutExtension]);

  const handleSaveClick = () => {
    if (newFileName !== undefined) {
      // Include the file extension if it exists
      const updatedName = extension
        ? `${newFileName}.${extension}`
        : newFileName;
      const updatedFileData = { ...fileData, name: updatedName }; // Use updatedName instead of text
      handleRename(updatedFileData);
      close();
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewFileName(e.target.value);
  };

  return (
    <div className="overlay-rename active">
      <div className="card-rename">
        <div
          className="card-content"
          style={{ width: "100%", height: "60px", overflow: "hidden" }}
        >
          <div className="rename-input-container">
            <textarea
              className="rename-textarea"
              value={newFileName}
              onChange={handleChange}
              style={{ overflowY: "hidden" }}
              rows={1}
            />
            <span
              className="file-extension"
              style={{ color: "lightgrey", pointerEvents: "none" }}
            >
              {extension && `.${extension}`}
            </span>
          </div>
        </div>
        <div className="card-footer" style={{ marginTop: "20px" }}>
          <button onClick={close}>{t("cancelButton")}</button>
          <button className="saveButton" onClick={handleSaveClick}>
            {t("confirmButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameModal;
