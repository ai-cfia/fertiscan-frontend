import theme from "@/app/theme";
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
  useMediaQuery,
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
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  /**
   * Function to handle the toggling of the side navigation menu
   */
  const handleSideNavToggle = () => {
    setSideNavOpen((prevOpen) => !prevOpen);
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between", height: "100%" }}>
        {/* Navigation menu toggle button on the left */}
        <IconButton edge="start" onClick={handleSideNavToggle}>
          <MenuIcon />
        </IconButton>

        {/* Logo container in the center */}
        <Box
          sx={{
            ...theme.logoSize,
          }}
        >
          <Link href="https://inspection.canada.ca">
            <Logo
              src="/img/CFIA_FIP_FR_WHITE_1.png"
              alt="logo"
              fill={true}
              priority
            />
          </Link>
        </Box>

        {/* User interaction components on the right */}
        <Box
          sx={{
            display: "flex",
          }}
        >
          {/* Language toggle button */}
          <Button
            sx={{
              alignSelf: "center",
              textTransform: "unset",
            }}
          >
            <Typography sx={{ textDecoration: "underline" }}>
              {isSmallScreen ? "FR" : "Français"}
            </Typography>
          </Button>

          {/* User account icon button */}
          <IconButton
            sx={{ alignSelf: "center" }}
            onClick={() => console.log("User Account Clicked")}
          >
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
