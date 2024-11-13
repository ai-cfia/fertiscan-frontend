"use client";
import UserMenu from "@/components/UserMenu";
import useBreakpoints from "@/utils/useBreakpoints";
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
import { useState } from "react";
import AlertBanner from "./AlertBanner";

interface HeaderProps {
  setSideNavOpen: (open: boolean | ((prevOpen: boolean) => boolean)) => void;
}
/**
 * Header Component
 *
 * This component renders the header of the web application which includes:
 * - Navigation menu toggle button
 * - Logo of the application
 * - Language button
 * - User account icon button
 */

const Header: React.FC<HeaderProps> = ({ setSideNavOpen }) => {
  const theme = useTheme();
  const { isDownXs, isBetweenXsSm, isBetweenSmMd } = useBreakpoints();
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSideNavToggle = () => {
    setSideNavOpen((prevOpen) => !prevOpen);
  };

  const handleUserMenuToggle = (event: React.MouseEvent<HTMLElement>) => {
    setIsUserMenuOpen(true);
    setAnchorElement(event.currentTarget);
  };

  return (
    <>
      <Box className="grow">
        <AppBar className="!static darkContainer" data-testid="header-appbar">
          <Toolbar
            className="justify-between h-full"
            data-testid="header-toolbar"
          >
            {/* Navigation menu toggle button on the left */}
            <IconButton
              edge="start"
              onClick={handleSideNavToggle}
              data-testid="menu-toggle-button"
            >
              <MenuIcon fontSize="large" />
            </IconButton>

            {/* Logo container in the center */}
            <Box
              sx={{
                ...theme.logoSize,
              }}
              data-testid="logo-container"
            >
              <Link href="https://inspection.canada.ca">
                <Image
                  className="cursor-pointer !relative"
                  src="/img/CFIA_FIP_FR_WHITE_1.png"
                  alt="logo"
                  fill={true}
                  priority
                  data-testid="logo-image"
                />
              </Link>
            </Box>

            {/* User interaction components on the right */}
            <Box className="flex" data-testid="user-interaction-box">
              {/* Language toggle button */}
              <Button
                className="align-center"
                data-testid="language-toggle-button"
              >
                <Typography
                  className="lowercase underline"
                  data-testid="language-text"
                >
                  {isDownXs || isBetweenXsSm || isBetweenSmMd
                    ? "FR"
                    : "Français"}
                </Typography>
              </Button>

              {/* User account icon button */}
              <IconButton
                className="self-center"
                onClick={handleUserMenuToggle}
                data-testid="user-account-button"
              >
                <AccountCircleIcon fontSize="large" />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <UserMenu
          anchorElement={anchorElement}
          isUserMenuOpen={isUserMenuOpen}
          setIsUserMenuOpen={setIsUserMenuOpen}
          setAnchorElement={setAnchorElement}
        />
      </Box>
      <AlertBanner></AlertBanner>
    </>
  );
};

export default Header;
