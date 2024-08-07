import { useTranslation } from "react-i18next";
import "./ContextMenu.css";
import BlobData from "../../interfaces/BlobData";

interface ContextMenuProps {
  fileData: BlobData;
  onRenameClick: (fileData: BlobData) => void;
  onDeleteClick: (fileData: BlobData) => void;
  onMouseLeave: () => void;
  mouseX: number;
  mouseY: number;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  fileData,
  onRenameClick,
  onDeleteClick,
  onMouseLeave,
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

  const handleDelete = () => {
    onDeleteClick(fileData);
    onClose();
  };

  return (
    <div
      className="context-menu"
      style={{ top: mouseY - 25, left: mouseX - 20 }}
      onClick={handleClick}
      onMouseLeave={onMouseLeave}
    >
      <div className="background-context-menu">
        <ul>
          <li onClick={handleRename}>{t("rename")}</li>
          <li onClick={handleDelete}>{t("delete")}</li>
        </ul>
      </div>
    </div>
  );
};

export default ContextMenu;
