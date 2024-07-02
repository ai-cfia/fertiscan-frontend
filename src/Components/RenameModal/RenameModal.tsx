import React from "react";
import "../Modal/Modal.css";
import { useTranslation } from "react-i18next";

interface RenameModalProps {
  text: string;
  file: File;
  handleRename: (newFile: File) => void;
  close: () => void;
  updateNewFileName: (newName: string) => void;
}

const RenameModal: React.FC<RenameModalProps> = ({
  text,
  file,
  handleRename,
  close,
  updateNewFileName,
}) => {
  const { t } = useTranslation();

  const handleSaveClick = () => {
    const newFile = new File([file], text, {
      type: file.type,
      lastModified: file.lastModified,
    });
    handleRename(newFile);
    close();
  };

  return (
    <div className="overlay-rename active">
      <div className="card-rename" style={{ width: "100%", height: "100px" }}>
        <div className="card-content" style={{ width: "100%", height: "40px", overflow:"hidden" }}>
          <textarea
            className="rename-textarea"
            value={text}
            onChange={(e) => updateNewFileName(e.target.value)}
            style={{ width: "100%", height: "40px",}}
          />
        </div>
        <div className="card-footer">
          <button onClick={close}>
            {t("cancelButton")}
          </button>
          <button className="saveButton" onClick={handleSaveClick}>
            {t("confirmButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameModal;