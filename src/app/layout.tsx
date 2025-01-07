"use client";
import Header from "@/components/Header";
import SideNav from "@/components/Sidenav";
import useAlertStore from "@/stores/alertStore";
import { Box } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import "dotenv/config";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./globals.css";
import "./i18n";
import theme from "./theme";
import RouteGuard from "@/components/AuthComponents/RouteGuard";
import DevMenu from "@/components/DevMenu";
import useDevStore from "@/stores/devStore";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const { showAlert } = useAlertStore();
  const { t, i18n } = useTranslation(["alertBanner", "translation"]);
  const { isDemoUser } = useDevStore();

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
            <RouteGuard>
              <SideNav open={sideNavOpen} onClose={handleDrawerClose} />
              <Header setSideNavOpen={setSideNavOpen} />
              <Box className="mt-16">
                {children}
                { isDemoUser || process.env.NODE_ENV === "development" &&
                  <DevMenu />
                }
              </Box>
              </RouteGuard>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
