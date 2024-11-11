import React from 'react';
import Link from 'next/link';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import BugReportIcon from '@mui/icons-material/BugReport';

interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
}

const SideNav = ({ open, onClose }: DrawerMenuProps) => {
  const theme = useTheme();

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
          overflowX: "hidden"
        },
      }}
    >
      <Box
        sx={{
          width: 250,
          height: '100%', // Ensure the box takes the full height of the drawer
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between', // This will push the last item to the bottom
          color: theme.palette.text.primary,
        }}
        role="presentation"
        onClick={onClose}
      >
        <div>
          <Toolbar>
            <Typography variant="h5">FertiScan</Typography>
          </Toolbar>
          <List>
            <Link href="/" passHref >
            <Tooltip title="Go to New Inspection" placement='right'>
              <ListItemButton>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="New inspection" />
              </ListItemButton>
              </Tooltip>
            </Link>
          <Tooltip title="Go to Search Page" placement='right'>
            <Link href="/SearchPage" passHref>
              <ListItemButton>
                <ListItemIcon>
                  <SearchIcon />
                </ListItemIcon>
                <ListItemText primary="Search" />
              </ListItemButton>
            </Link>
          </Tooltip>
          </List>
        </div>
        <div>
          <List>
            <Tooltip title="Report an issue" placement='right'>
            <Link href="https://github.com/ai-cfia/fertiscan-frontend/issues/new/choose" passHref>
              <ListItemButton>
                <ListItemIcon>
                  <BugReportIcon />
                </ListItemIcon>
                <ListItemText primary="Report an issue" />
              </ListItemButton>
            </Link>
            </Tooltip>
          </List>
        </div>
      </Box>
    </Drawer>
  );
};

export default SideNav;
