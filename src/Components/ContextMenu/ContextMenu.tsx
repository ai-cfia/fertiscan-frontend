import React from 'react';
import './ContextMenu.css';
import { useTranslation } from "react-i18next";

interface ContextMenuProps {
  file: File; // The file object provided by the parent component.
  onRenameClick: (file: File) => void; // The rename handler provided by the parent component.
  mouseX: number; // X-position for the menu.
  mouseY: number; // Y-position for the menu.
  onClose: () => void; // Handler to close the menu.
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  file,
  onRenameClick,
  mouseX,
  mouseY,
  onClose
}) => {
  // Closes context menu on click outside.
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClose();
  };

  const handleRename = () => {
    onRenameClick(file); // Call the passed handler with the file to be renamed
    onClose(); // Close the context menu
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