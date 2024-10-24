"use client";
import Header from "@/component/Header";
import SideNav from "@/component/Sidenav";
import { Box } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { useStore } from "@/store/useStore";
import "./globals.css";
import theme from "./theme";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { sideNavOpen } = useStore();

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <SideNav open={sideNavOpen} />
            {/* Margin adjustment based on SideNav state */}
            <Box
              sx={{
                transition: theme.transitions.create(["margin", "width"], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
              }}
              marginLeft={sideNavOpen ? "240px" : 0}
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
