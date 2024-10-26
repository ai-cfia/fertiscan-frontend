import { getSize } from "@/utils/themeUtils";
import useBreakpoints from "@/utils/useBreakpoints";
import styled from "@emotion/styled";
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
      {/* AppBar component for the header */}
      <AppBar position="static">
        <Toolbar>
          {/* Navigation menu toggle button */}
          <IconButton
            color="inherit"
            edge="start"
            aria-label="menu"
            sx={{ fontSize: getSize(theme, "medium", breakpoints) }}
            onClick={handleSideNavToggle}
          >
            <MenuIcon sx={{ fontSize: "inherit" }} />
          </IconButton>

          {/* Logo container in the center */}
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
              {/* Link to the home page with the logo */}
              <Link href="https://inspection.canada.ca">
                <Logo
                  src="/img/CFIA_FIP_FR_WHITE_1.png"
                  alt="logo"
                  fill={true}
                  priority
                />
              </Link>
            </Box>
          </Box>

          {/* User interaction components */}
          <Box sx={{ display: "flex", alignItems: "end" }}>
            {/* Language toggle button */}
            <Button
              color="inherit"
              sx={{
                padding: { xs: "0.1vw", md: "0.5vw", lg: "0.5vw", xl: "0.5vw" },
                display: "contents",
                textTransform: "unset",
              }}
            >
              <Typography
                sx={{ alignSelf: "center", textDecoration: "underline" }}
              >
                {" "}
                Français{" "}
              </Typography>
            </Button>

            {/* User account icon button */}
            <IconButton
              color="inherit"
              sx={{ fontSize: getSize(theme, "medium", breakpoints) }}
              onClick={() => console.log("User Account Clicked")}
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
