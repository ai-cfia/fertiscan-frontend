import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import MenuIcon from '@mui/icons-material/Menu';

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ open, onClose }) => {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <div
        style={{
          width: 250,
          backgroundColor: '#01304c',
          height: '100%',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <List>
          <ListItem>
            <ListItemIcon style={{ color: 'white' }}>
              <MenuIcon fontSize='large' onClick={onClose}/>
            </ListItemIcon>
            <ListItemText primary="FertiScan" />
          </ListItem>
          <ListItem component="li">
            <ListItemIcon style={{ color: 'white' }}>
              <HomeOutlinedIcon fontSize='large' />
            </ListItemIcon>
            <ListItemText primary="New inspection" />
          </ListItem>
          <ListItem component="li">
            <ListItemIcon style={{ color: 'white' }}>
              <SearchOutlinedIcon fontSize='large'/>
            </ListItemIcon>
            <ListItemText primary="Search label" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem component="li">
            <ListItemIcon style={{ color: 'white' }}>
              <ErrorOutlineOutlinedIcon fontSize='large'/>
            </ListItemIcon>
            <ListItemText primary="Report issue" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default SideMenu;