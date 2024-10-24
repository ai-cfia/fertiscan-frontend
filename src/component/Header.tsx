import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import styled from "@emotion/styled";
import UserPopup from "@/component/UserPopup";
import { useStore } from "@/store/useStore";
import { getSize } from "@/utils/themeUtils";
import useBreakpoints from "@/utils/useBreakpoints";

const Logo = styled(Image)`
  position: relative !important;
`;

const Header = () => {
  const theme = useTheme();
  const breakpoints = useBreakpoints();
  const { setSideNavOpen, sideNavOpen, setUserPopUpOpen, setAnchorElement } =
    useStore();

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
          <IconButton
            color="inherit"
            edge="start"
            aria-label="menu"
            sx={{ fontSize: getSize(theme, "medium", breakpoints) }}
            onClick={handleSideNavToggle}
          >
            <MenuIcon sx={{ fontSize: "inherit" }} />
          </IconButton>
          <Box
            position="relative"
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Box
              sx={{
                width: {
                  xs: theme.logoSizes.width.xs,
                  sm: theme.logoSizes.width.sm,
                  md: theme.logoSizes.width.md,
                  lg: theme.logoSizes.width.lg,
                  xl: theme.logoSizes.width.xl,
                },
                height: {
                  xs: theme.logoSizes.height.xs,
                  sm: theme.logoSizes.height.sm,
                  md: theme.logoSizes.height.md,
                  lg: theme.logoSizes.height.lg,
                  xl: theme.logoSizes.height.xl,
                },
              }}
            >
              <Link href="https://inspection.canada.ca">
                <Logo
                  src="/img/CFIA FIP FR WHITE 1.png"
                  alt="logo"
                  layout="fill"
                  objectPosition="50% 50%"
                />
              </Link>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "end" }}>
            <Button
              color="inherit"
              sx={{
                padding: { xs: "0.1vw", md: "0.5vw", lg: "0.5vw", xl: "0.5vw" },
                display: "contents",
                textTransform: "unset",
              }}
            >
              <Typography
                variant="h6"
                sx={{ alignSelf: "center", textDecoration: "underline" }}
              >
                {" "}
                Français{" "}
              </Typography>
            </Button>
            <IconButton
              color="inherit"
              sx={{ fontSize: getSize(theme, "medium", breakpoints) }}
              onClick={handleUserPopUpToggle}
            >
              <AccountCircleIcon fontSize="inherit" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <UserPopup />
    </Box>
  );
};

export default Header;
