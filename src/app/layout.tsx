import RouteGuard from "@/components/auth-components/RouteGuard";
import Header from "@/components/Header";
import SideNav from "@/components/Sidenav";
import { Box } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import type { Metadata } from "next";
import "./globals.css";
import theme from "./theme";

export const metadata: Metadata = {
  title: {
    template: "%s - FertiScan",
    default: "FertiScan",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <RouteGuard className="flex min-h-screen flex-col">
              <SideNav />
              <Header />
              <Box className="mt-16 flex-grow bg-white">{children}</Box>
            </RouteGuard>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
