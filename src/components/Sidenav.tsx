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
      onClick={onClose} // Added this to close the drawer when an item is clicked
      onKeyDown={onClose} // Also close the drawer when a key is pressed (e.g., Esc)
    >
      <Toolbar>
        <Typography>Menu</Typography>
      </Toolbar>
      <List>
        <ListItemButton>
          <ListItemText primary="Item 1" />
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Item 2" />
        </ListItemButton>
        {/* Add more items as needed */}
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
      transitionDuration={0}
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
