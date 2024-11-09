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
}

const SideNav = ({ open }: DrawerMenuProps) => {
  const theme = useTheme();
  const drawerContent = (
    <Box
      sx={{
        width: 250,
        color: theme.palette.text.primary,
      }}
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
      className="darkContainer"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
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
