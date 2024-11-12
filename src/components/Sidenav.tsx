import React from 'react';
import Link from 'next/link';
import {
  Box,
  Divider,
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
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: theme.palette.text.primary,
        }}
        role="presentation"
        data-testid="backdrop"
        onClick={onClose}
      >
        <div>
          <Toolbar>
            <Typography variant="h5">FertiScan</Typography>
          </Toolbar>

          <List>
          <Divider />
          <Tooltip title="Go to New Inspection" placement='right'>
            <Link href="/" passHref data-testid="new-inspection-button" >
              <ListItemButton>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="New inspection" />
              </ListItemButton>
            </Link>
            </Tooltip>
            <Divider />
          <Tooltip title="Go to Search Page" placement='right'>
            <Link href="/SearchPage" passHref data-testid="search-page-button">
              <ListItemButton>
                <ListItemIcon>
                  <SearchIcon />
                </ListItemIcon>
                <ListItemText primary="Search" />
              </ListItemButton>
            </Link>
          </Tooltip>
          <Divider />
          </List>
        </div>
        <div>
          <List>
          <Divider />
            <Tooltip title="Report an issue" placement='right'>
            <Link href="https://github.com/ai-cfia/fertiscan-frontend/issues/new/choose" passHref data-testid="report-issue-button">
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
