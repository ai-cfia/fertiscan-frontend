"use client";
import Header from "@/component/Header";
import SideNav from "@/component/Sidenav";
import { Box } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import "./globals.css";
import theme from "./theme";
import UserPopup from "@/component/Userpopup";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [SideNavOpen, setSideNavOpen] = useState(false);
  const [UserPopUpOpen, setUserPopUpOpen] = useState(false);

  const handleSideNavToggle = () => {
    setSideNavOpen(!SideNavOpen);
  };

  const handleUserPopUpToggle = () => {
    setUserPopUpOpen(!UserPopUpOpen);
  };

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <SideNav open={SideNavOpen} />
            <Box
              sx={{
                transition: theme.transitions.create(["margin", "width"], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
              }}
              marginLeft={SideNavOpen ? "240px" : 0}
            >
              <Header
                isSideNavOpen={SideNavOpen}
                isUserPopUpOpen={UserPopUpOpen}
                handleSideNavToggle={handleSideNavToggle}
                handleUserPopUpToggle={handleUserPopUpToggle}
              />
              {children}
            </Box>
            <UserPopup open={UserPopUpOpen} />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
