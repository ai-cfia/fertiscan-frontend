import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface ContextMenuProps {
  contextMenuPosition: { mouseX: number; mouseY: number } | null;
  handleClose?: () => void;
  handleRename: (newName: string) => void;
}

const ContextMenu: React.FC<ContextMenuProps & { handleDelete: () => void }> = ({
  contextMenuPosition,
  handleClose,
  handleRename,
  handleDelete,
  
}) => {
  function handleCloseContextMenu () {
    if (handleClose) {
      handleClose();
    }
  }

  return (
    <Menu
      open={contextMenuPosition !== null}
      onClose={handleCloseContextMenu}
      anchorReference="anchorPosition"
      anchorPosition={contextMenuPosition ? { top: contextMenuPosition.mouseY, left: contextMenuPosition.mouseX } : undefined}
    >
      <MenuItem onClick={() => {
        let newName = prompt("Please enter new name");
        if (newName) {
          handleRename(newName);
          handleCloseContextMenu();
        }
      }}>Rename</MenuItem>
      <MenuItem onClick={() => {
          console.log("Delete is not implemented in the context menu right now");
          handleDelete();
          handleCloseContextMenu();
      }}>Delete</MenuItem>
      <MenuItem onClick={handleCloseContextMenu}>Do not analyzed</MenuItem>
    </Menu>
  );
}

export default ContextMenu;