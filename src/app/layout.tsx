"use client";
import Header from "@/components/Header";
import SideNav from "@/components/Sidenav";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import "./globals.css";
import theme from "./theme";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [sideNavOpen, setSideNavOpen] = useState(false);

  const handleDrawerClose = () => {
    setSideNavOpen(false);
  };

  return (
    <html lang="en">
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
