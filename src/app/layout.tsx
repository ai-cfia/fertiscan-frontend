import RouteGuard from "@/components/AuthComponents/RouteGuard";
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
    <html lang={i18n.language}>
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>{ i18n.language === "en" ? "CFIA Label Data Validator" : "ACIA Validateur de données d'étiquette"}</title>
      </head>
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
