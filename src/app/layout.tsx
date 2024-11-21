"use client";
import Header from "@/components/Header";
import SideNav from "@/components/Sidenav";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import "./globals.css";
import theme from "./theme";
import "dotenv/config";
import "./i18n";
import useAlertStore from "@/stores/alertStore";
import { useTranslation } from "react-i18next";
import DevMenu from "@/components/dev-menu/DevMenu";
import logService from "@/utils/devtools/overrideConsole";
import { Button } from "@mui/material";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const { showAlert } = useAlertStore();
  const { t, i18n } = useTranslation(["alertBanner", "translation"]);
  const debugMode = process.env.NEXT_PUBLIC_DEBUG === 'true';
  const devMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

  if (debugMode) {
   //console.log(t("debugMessage"));
  }

  const handleDrawerClose = () => {
    setSideNavOpen(false);
  };

  const handleLanguageChange = (lng: string) => {
    showAlert(t("languageChanged", { lng }), "info");
  };

  i18n.on("languageChanged", handleLanguageChange);
   // TODO: Add a check for a specific user that is the only one who can see the dev menu for presentation purposes.
    useEffect(() => {
      if (devMode) {
        logService.overrideConsoleMethods();
      }
    }, []);

  const handleLogClick = () => {
    console.log("Test log");
    console.warn("Test warn");
    console.error("Test error");
    console.info("Test info");
  };

  return (
    <html>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <DevMenu />
            <SideNav open={sideNavOpen} onClose={handleDrawerClose} />
            <Header setSideNavOpen={setSideNavOpen} />
            {children}
            <Button onClick={handleLogClick}>Test logs</Button>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
