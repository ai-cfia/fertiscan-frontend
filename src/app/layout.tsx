import RouteGuard from "@/components/AuthComponents/RouteGuard";
import Header from "@/components/Header";
import SideNav from "@/components/Sidenav";
import { Box } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import "./globals.css";
import theme from "./theme";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <RouteGuard className="flex flex-col min-h-screen">
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
