"use client";
import Header from "@/component/Header";
import SideNav from "@/component/Sidenav";
import { Box } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { Roboto } from "next/font/google";
import { useState } from "react";
import "./globals.css";
import theme from "./theme";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [SideNavOpen, setSideNavOpen] = useState(false);

  const handleDrawerToggle = () => {
    console.log("aaaa");
    setSideNavOpen(!SideNavOpen);
    console.log(SideNavOpen);
  };
  return (
    <html lang="en">
      <body className={roboto.variable}>
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
                handleDrawerToggle={handleDrawerToggle}
              />
              {children}
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
