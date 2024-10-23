import React, { useState } from "react";
import { Drawer, Box, Typography, Button, IconButton, useTheme, MenuItem, Avatar, Menu, ListItemIcon, Divider} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import { Logout, PersonAdd, Settings } from "@mui/icons-material";

interface DrawerUserProps {
    open: boolean;
  }

  // Need to modify anchor to place it in the layout/header file and also need to modify the styling and content of it 
const UserPopup = ({ open }: DrawerUserProps) => {
const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
const theme = useTheme();
  const placeholderUser = {
    username: "User-test-1",
    version: "alpha 0.2.0"
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
        </Menu>
    );
  };

export default UserPopup;