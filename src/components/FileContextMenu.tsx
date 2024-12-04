import {
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  useTheme,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import CreateIcon from "@mui/icons-material/Create";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DeleteIcon from "@mui/icons-material/Delete";

interface FileContextMenuProps {
  mouseX: number;
  mouseY: number;
  handleClose: () => void;
  onDelete: () => void;
  onRename: () => void;
  onDeleteAll: () => void;
}

const FileContextMenu: React.FC<FileContextMenuProps> = ({
  mouseX,
  mouseY,
  handleClose,
  onDelete,
  onRename,
  onDeleteAll,
}) => {
  const { t } = useTranslation("homePage");
  const theme = useTheme();

  return (
    <Paper
      style={{
        position: "absolute",
        top: mouseY,
        left: mouseX,
        zIndex: 1000,
      }}
    >
      <MenuList className="bg-white shadow rounded-lg">
      <MenuItem
          onClick={() => {
            onRename();
            handleClose();
          }}
          className="hover:bg-gray-100"
        >
          <ListItemIcon aria-label={t("fileElement.contextMenu.altText.contextMenuRenameIconAlt")}>
            <CreateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("fileElement.contextMenu.rename")}</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            onDelete();
            handleClose();
          }}
          className="hover:bg-gray-100"
        >
          <ListItemIcon aria-label={t("fileElement.contextMenu.altText.contextMenuDeleteIconAlt")}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("fileElement.contextMenu.delete")}</ListItemText>
        </MenuItem>

        <Divider
          orientation="horizontal"
          flexItem
          color={theme.palette.primary.dark}
          sx={{ borderRightWidth: 3 }} // className="border-r-2" dont work
        />

        <MenuItem
          onClick={() => {
            onDeleteAll();
            handleClose();
          }}
          className="hover:bg-gray-100"
        >
          <ListItemIcon aria-label={t("fileElement.contextMenu.altText.contextMenuDeleteALLIconAlt")}>
            <DeleteSweepIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("fileElement.contextMenu.deleteAll")}</ListItemText>
        </MenuItem>
      </MenuList>
    </Paper>
  );
};

export default FileContextMenu;
