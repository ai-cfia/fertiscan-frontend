import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface ContextMenuProps {
  contextMenuPosition: { mouseX: number; mouseY: number } | null;
//  setContextMenuPosition: React.Dispatch<React.SetStateAction<{ mouseX: number; mouseY: number } | null>>;
  handleClose?: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  contextMenuPosition,
//  setContextMenuPosition,
  handleClose,
  
}) => {
  const handleCloseContextMenu = () => {
    if (handleClose) {
      handleClose();
    }
  };

  return (
    <Menu
      open={contextMenuPosition !== null}
      onClose={handleCloseContextMenu}
      anchorReference="anchorPosition"
      anchorPosition={contextMenuPosition ? { top: contextMenuPosition.mouseY, left: contextMenuPosition.mouseX } : undefined}
    >
      <MenuItem onClick={handleCloseContextMenu}>Rename</MenuItem>
      <MenuItem onClick={handleCloseContextMenu}>Delete</MenuItem>
      <MenuItem onClick={handleCloseContextMenu}>Not analyze</MenuItem>
    </Menu>
  );
}

export default ContextMenu;