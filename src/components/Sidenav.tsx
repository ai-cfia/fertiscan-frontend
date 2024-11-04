import React from 'react';
import Link from 'next/link';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
}

const SideNav = ({ open, onClose }: DrawerMenuProps) => {
  const theme = useTheme();

  const drawerContent = (
    <Box
      sx={{
        width: 250,
        color: theme.palette.text.primary,
      }}
      role="presentation"
      onClick={onClose}
    >
      <Toolbar>
        <Typography variant="h5">FertiScan</Typography>
      </Toolbar>
      <List>
      <Link href="/" passHref>
        <ListItemButton>
          <ListItemText primary="Item 1" />
        </ListItemButton>
      </Link>
      <Link href="/search" passHref>
        <ListItemButton>
          <ListItemText primary="Item 2" />
        </ListItemButton>
      </Link>
      </List>
    </Box>
  );

  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
      variant="temporary"
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.secondary.main,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default SideNav;
