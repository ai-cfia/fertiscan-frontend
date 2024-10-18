import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface ContextMenuProps {
  contextMenuPosition: { mouseX: number; mouseY: number } | null;
  handleClose?: () => void;
  handleRename: (newName: string) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  contextMenuPosition,
  handleClose,
  handleRename,
  
}) => {
  function handleCloseContextMenu () {
    if (handleClose) {
      handleClose();
    }
  }

  function SendActionContextMenu () {
    console.log("Rename");
  }

  return (
    <Menu
      open={contextMenuPosition !== null}
      onClose={handleCloseContextMenu}
      anchorReference="anchorPosition"
      anchorPosition={contextMenuPosition ? { top: contextMenuPosition.mouseY, left: contextMenuPosition.mouseX } : undefined}
    >
      <MenuItem onClick={() => {
        let newName = prompt("Please enter new name"); // Ask user for a new name
        if (newName) {
          handleRename(newName); // Call parent's handleRename with the new name
          handleCloseContextMenu(); // Close the menu
        }
      }}>Rename</MenuItem>
      <MenuItem onClick={handleCloseContextMenu}>Delete</MenuItem>
      <MenuItem onClick={handleCloseContextMenu}>Not analyze</MenuItem>
    </Menu>
  );
}

export default ContextMenu;