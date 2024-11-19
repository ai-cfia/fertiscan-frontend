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
import i18next from "i18next";
import { useTranslation } from "react-i18next";

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
  const [language, setLanguage] = useState('en');
  const { t } = useTranslation('header');

  const handleSideNavToggle = () => {
    setSideNavOpen((prevOpen) => !prevOpen);
  };

  const handleUserMenuToggle = (event: React.MouseEvent<HTMLElement>) => {
    setIsUserMenuOpen(true);
    setAnchorElement(event.currentTarget);
  };

  // Function to handle language change
  const changeLanguage = (lang: string) => {
    i18next.changeLanguage(lang, (err, t) => {
      if (err) return console.log('something went wrong loading', err);
      t('key');
      setLanguage(lang);
    });
  };

  return (
    <>
      <Box className="grow ">
        <AppBar className="!static header darkContainer" data-testid="header-appbar">
          <Toolbar
            className="justify-between h-full"
            data-testid="header-toolbar"
          >
            {/* Navigation menu toggle button on the left */}
            <IconButton
              aria-label={t('altText.sideMenuToggleAlt')}
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
                  alt={t('altText.logoCFIAAlt')}
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
                onClick={() => changeLanguage(language === 'en' ? 'fr' : 'en')}
                data-testid="language-toggle-button"
              >
                <Typography
                  className="normal-case underline"
                  data-testid="language-text"
                >
                  {language === 'en'
                    ? (isDownXs || isBetweenXsSm || isBetweenSmMd ? t('language.short') : t('language.full'))
                    : (isDownXs || isBetweenXsSm || isBetweenSmMd ? t('language.short', { lng: 'fr' }) : t('language.full', { lng: 'fr' }))}
                </Typography>
              </Button>

              {/* User account icon button */}
              <IconButton
                aria-label={t('altText.userAccountAlt')}
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
