"use client";
import Header from "@/components/Header";
import SideNav from "@/components/Sidenav";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { use, useEffect, useState } from "react";
import "./globals.css";
import theme from "./theme";
import "dotenv/config";
import "./i18n";
import useAlertStore from "@/stores/alertStore";
import { useTranslation } from "react-i18next";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const { showAlert } = useAlertStore();
  const { t, i18n } = useTranslation(["alertBanner", "translation"]);
  const debugMode = process.env.NEXT_PUBLIC_DEBUG === 'true';

  if (debugMode) {
   console.log(t("debugMessage"));
  }

  const handleDrawerClose = () => {
    setSideNavOpen(false);
  };

  const handleLanguageChange = (lng: string) => {
    showAlert(t("languageChanged", { lng }), "info");
  };

  i18n.on("languageChanged", handleLanguageChange);

  return (
    <html>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <SideNav open={sideNavOpen} onClose={handleDrawerClose} />
            <Header setSideNavOpen={setSideNavOpen} />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
