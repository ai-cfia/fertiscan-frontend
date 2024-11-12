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
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import BugReportIcon from '@mui/icons-material/BugReport';

interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
}

const SideNav = ({ open, onClose }: DrawerMenuProps) => {
  return (
    <Drawer
      className='darkContainer w-[240px] flex-shrink-0'
      variant="temporary"
      variant="persistent"
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      PaperProps={{
        className:"w-[240px] box-border overflow-x-hidden",
      }}
    >
      <Box className="w-250 h-full flex flex-col justify-between text-white bg-sky-900"
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
