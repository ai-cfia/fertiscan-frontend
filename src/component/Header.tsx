import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import styled from "@emotion/styled";
import UserPopup from "@/component/UserPopup";
import { useStore } from "@/store/useStore";

const Logo = styled(Image)`
  position: relative !important;
`;

const Header = () => {
  const { setSideNavOpen, sideNavOpen, setUserPopUpOpen, setAnchorElement } = useStore();

  const handleSideNavToggle = () => {
    setSideNavOpen(!sideNavOpen);
  };

  const handleUserPopUpToggle = (event: React.MouseEvent<HTMLElement>) => {
    setUserPopUpOpen(true);
    setAnchorElement(event.currentTarget);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" edge="start" aria-label="menu" onClick={handleSideNavToggle}>
            <MenuIcon sx={{ fontSize: { xs: '5vw', md: '3vw', xl: '3vw' } }} />
          </IconButton>
          <Box position="relative" sx={{ width: { xs: '100%' }, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: { xs: '25vw' }, height: '100%' }}>
              <Link href="https://inspection.canada.ca">
                <Logo src="/img/CFIA FIP FR WHITE 1.png" alt="logo" layout="fill" objectPosition="50% 50%" />
              </Link>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'end' }}>
            <Button color="inherit" sx={{ padding: { xs: '0.1vw', md: '0.5vw', lg: '0.5vw', xl: '0.5vw' }, display: 'contents', textTransform: 'unset' }}>
              <Typography sx={{ alignSelf: 'center', fontSize: { xs: '2vw', md: '1.5vw', lg: '1vw', xl: '1.2vw' }, textDecoration: 'underline' }}> Français </Typography>
            </Button>
            <IconButton color="inherit" onClick={handleUserPopUpToggle}>
              <AccountCircleIcon fontSize="large" sx={{ fontSize: { xs: '3vw', md: '3vw', xl: '2.5vw' } }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <UserPopup />
    </Box>
  );
};

export default Header;
