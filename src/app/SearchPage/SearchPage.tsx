"use client";
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import "./globals.css";

const SearchPage: React.FC = () => {
    const theme = useTheme();
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                backgroundColor: theme.palette.background.default,
                padding: 3,
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom>
                This is a place holder for the real search page component
              </Typography>
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default SearchPage;
