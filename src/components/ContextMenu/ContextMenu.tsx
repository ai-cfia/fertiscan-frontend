import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// Type definition for the expected props, adjust as needed
interface ContextMenuProps {
  contextMenuPosition: { mouseX: number; mouseY: number } | null;
  setContextMenuPosition: React.Dispatch<React.SetStateAction<{ mouseX: number; mouseY: number } | null>>;
  handleClose?: () => void;
  // Add any additional props here
}

const ContextMenu: React.FC<ContextMenuProps> = ({ contextMenuPosition, setContextMenuPosition, handleClose }) => {
  // Handling the closing of the context menu
  const handleCloseContextMenu = () => {
    setContextMenuPosition(null); // Close context menu
    if (handleClose) {
      handleClose(); // Call additional handleClose callback if provided
    }
  };

  return (
    <Menu
      open={contextMenuPosition !== null}
      onClose={handleCloseContextMenu}
      anchorReference="anchorPosition"
      anchorPosition={
        contextMenuPosition
          ? { top: contextMenuPosition.mouseY, left: contextMenuPosition.mouseX }
          : undefined
      }
    >
      <MenuItem onClick={handleCloseContextMenu}>Rename</MenuItem>
      <MenuItem onClick={handleCloseContextMenu}>Delete</MenuItem>
      <MenuItem onClick={handleCloseContextMenu}>Not analyze</MenuItem>
    </Menu>
  );
}

export default ContextMenu;