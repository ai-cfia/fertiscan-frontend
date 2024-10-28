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
import { getSize } from "@/utils/themeUtils";
import useBreakpoints from "@/utils/useBreakpoints";

// Defining a styled component for the logo using emotion's styled
const Logo = styled(Image)`
  position: relative !important;
`;

/**
 * Header Component
 *
 * This component renders the header of the web application which includes:
 * - Navigation menu toggle button
 * - Logo of the application
 * - Language button
 * - User account icon button
 * - User pop-up component
 *
 */
interface HeaderProps {
  setSideNavOpen: (open: boolean | ((prevOpen: boolean) => boolean)) => void;
}

const Header: React.FC<HeaderProps> = ({ setSideNavOpen }) => {
  const theme = useTheme();
  const breakpoints = useBreakpoints();
  /**
   * Function to handle the toggling of the side navigation menu
   */
  const handleSideNavToggle = () => {
    setSideNavOpen((prevOpen) => !prevOpen);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
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
                  fill={true}
                  priority
                />
              </Link>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "end" }}>
            <Button
              variant="contained"
              color="primary"
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
              sx={{ fontSize: getSize(theme, "medium", breakpoints) }}
              onClick={()=>console.log("User Account Clicked")}
            >
              <AccountCircleIcon fontSize="inherit" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
