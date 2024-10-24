"use client";
import Header from "@/components/Header";
import SideNav from "@/components/Sidenav";
import { Box } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { useStore } from "@/store/useStore";
import "./globals.css";
import theme from "./theme";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [SideNavOpen, setSideNavOpen] = useState(false);

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <SideNav open={SideNavOpen} />
            {/* Margin adjustment based on SideNav state */}
            <Box
              sx={{
                transition: theme.transitions.create(["margin", "width"], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
              }}
              marginLeft={SideNavOpen ? "240px" : 0}
            >
              <Header />
              {children}
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
