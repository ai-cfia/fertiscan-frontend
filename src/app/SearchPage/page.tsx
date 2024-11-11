'use client';
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

function SearchPage() {
  const theme = useTheme();
  return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          padding: 3,
        }}
      >
        <Typography variant="h6" color={theme.palette.text.primary} gutterBottom>
          This is a placeholder for the search page for testing.
        </Typography>
      </Box>
  );
};

export default SearchPage;
