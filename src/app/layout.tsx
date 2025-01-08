"use client";
import Header from "@/components/Header";
import SideNav from "@/components/Sidenav";
import useAlertStore from "@/stores/alertStore";
import { Box } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import "dotenv/config";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./globals.css";
import "./i18n";
import theme from "./theme";
import RouteGuard from "@/components/AuthComponents/RouteGuard";
import DevMenu from "@/components/DevMenu";
import Cookies from "js-cookie";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [isDemoUser, setIsDemoUser] = useState(false);
  const { showAlert } = useAlertStore();
  const { t, i18n } = useTranslation(["alertBanner", "translation"]);
  const [showDevMenu, setShowDevMenu] = useState(false);

  const handleDrawerClose = () => {
    setSideNavOpen(false);
  };

  const handleLanguageChange = (lng: string) => {
    showAlert(t("languageChanged", { lng }), "info");
  };

  useEffect(() => {
    const checkUserToken = () => {
      const encodedToken = Cookies.get("token");
      if (encodedToken) {
        const decodedUsername = atob(encodedToken);
        console.log("Decoded Username:", decodedUsername);
        setIsDemoUser(decodedUsername === "demoFertiscan");
        setShowDevMenu(decodedUsername === "demoFertiscan" || Cookies.get("showDevMenu") === "true");
      }
    };

    checkUserToken(); // Initial check

    const intervalId = setInterval(() => {
      checkUserToken();
    }, 5000); // Check every 5 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this effect runs once on mount

  i18n.on("languageChanged", handleLanguageChange);

  // Log to track showDevMenu's effect
  useEffect(() => {
    console.log("showDevMenu", showDevMenu);
  }, [showDevMenu]);

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
                {(showDevMenu) && <DevMenu />}
                {isDemoUser && <div>This user is a demo user.</div>}
              </Box>
            </RouteGuard>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
