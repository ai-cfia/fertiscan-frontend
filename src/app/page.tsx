"use client"
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";
import { Box } from "@mui/material";

function Home() {

  return (
      <ThemeProvider theme={theme}>
        <Box>Test</Box>
      </ThemeProvider>
  );
}

export default Home;
