"use client";
import Header from "@/components/Header";
import SideNav from "@/components/Sidenav";
import { Box } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import "./globals.css";
import theme from "./theme";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [sideNavOpen, setSideNavOpen] = useState(false);

  const handleDrawerToggle = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'esc')) {
      return;
    }
    setSideNavOpen(open);
  };

  const handleDrawerClose = () => {
    setSideNavOpen(false);
  };

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <SideNav open={sideNavOpen} onClose={handleDrawerClose} />
            {/* Margin adjustment based on SideNav state */}
            <Box>
              <Header setSideNavOpen={setSideNavOpen} />
              {children}
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
