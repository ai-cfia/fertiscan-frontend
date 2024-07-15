import React from "react";
import "./ContextMenu.css";
import { useTranslation } from "react-i18next";

interface ContextMenuProps {
  fileData: { blob: string; name: string };
  onRenameClick: (fileData: { blob: string; name: string }) => void;
  mouseX: number;
  mouseY: number;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  fileData,
  onRenameClick,
  mouseX,
  mouseY,
  onClose,
}) => {
  const { t } = useTranslation();

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClose();
  };

  const handleRename = () => {
    onRenameClick(fileData);
    onClose();
  };
  
  return (
    <div
      className="context-menu"
      style={{ top: mouseY, left: mouseX }}
      onClick={handleClick}
    >
      <ul>
        <li onClick={handleRename}>{t("rename")}</li>
      </ul>
    </div>
  );
};

export default ContextMenu;
