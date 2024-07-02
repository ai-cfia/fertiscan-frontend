import React from 'react';
import './ContextMenu.css';
import { useTranslation } from "react-i18next";

interface ContextMenuProps {
  fileData: { blob: string; name: string }; // Updated to accept an object with blob and name
  onRenameClick: (fileData: { blob: string; name: string }) => void; // Update type definition
  mouseX: number;
  mouseY: number;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  fileData,    // Renamed from file to fileData
  onRenameClick,
  mouseX,
  mouseY,
  onClose
}) => {
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClose();
  };

  const handleRename = () => {
    onRenameClick(fileData); // Pass the fileData object instead
    onClose();
  };

  const { t } = useTranslation();

  return (
    <div className="context-menu" style={{ top: mouseY, left: mouseX }} onClick={handleClick}>
      <ul>
        <li onClick={handleRename}>{t("rename")}</li>
      </ul>
    </div>
  );
};

export default ContextMenu;