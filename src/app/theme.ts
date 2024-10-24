"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontSize: "1.5rem", // Default for xs
      [createTheme().breakpoints.up("sm")]: {
        fontSize: "2rem",
      },
      [createTheme().breakpoints.up("md")]: {
        fontSize: "2.5rem",
      },
      [createTheme().breakpoints.up("lg")]: {
        fontSize: "3rem",
      },
      [createTheme().breakpoints.up("xl")]: {
        fontSize: "3.5rem",
      },
    },
    h2: {
      fontSize: "1.25rem", // Default for xs
      [createTheme().breakpoints.up("sm")]: {
        fontSize: "1.5rem",
      },
      [createTheme().breakpoints.up("md")]: {
        fontSize: "2rem",
      },
      [createTheme().breakpoints.up("lg")]: {
        fontSize: "2.5rem",
      },
      [createTheme().breakpoints.up("xl")]: {
        fontSize: "3rem",
      },
    },
    h3: {
      fontSize: "1rem", // Default for xs
      [createTheme().breakpoints.up("sm")]: {
        fontSize: "1.2rem",
      },
      [createTheme().breakpoints.up("md")]: {
        fontSize: "1.5rem",
      },
      [createTheme().breakpoints.up("lg")]: {
        fontSize: "2rem",
      },
      [createTheme().breakpoints.up("xl")]: {
        fontSize: "2.4rem",
      },
    },
    h4: {
      fontSize: "0.875rem", // Default for xs
      [createTheme().breakpoints.up("sm")]: {
        fontSize: "1rem",
      },
      [createTheme().breakpoints.up("md")]: {
        fontSize: "1.25rem",
      },
      [createTheme().breakpoints.up("lg")]: {
        fontSize: "1.5rem",
      },
      [createTheme().breakpoints.up("xl")]: {
        fontSize: "1.75rem",
      },
    },
    h5: {
      fontSize: "0.75rem", // Default for xs
      [createTheme().breakpoints.up("sm")]: {
        fontSize: "0.875rem",
      },
      [createTheme().breakpoints.up("md")]: {
        fontSize: "1rem",
      },
      [createTheme().breakpoints.up("lg")]: {
        fontSize: "1.25rem",
      },
      [createTheme().breakpoints.up("xl")]: {
        fontSize: "1.5rem",
      },
    },
    h6: {
      fontSize: "0.45rem", // Default for xs
      [createTheme().breakpoints.up("sm")]: {
        fontSize: "0.55rem",
      },
      [createTheme().breakpoints.up("md")]: {
        fontSize: "0.875rem",
      },
      [createTheme().breakpoints.up("lg")]: {
        fontSize: "1rem",
      },
      [createTheme().breakpoints.up("xl")]: {
        fontSize: "1.25rem",
      },
    },
    body1: {
      fontSize: "0.875rem", // Default for xs
      [createTheme().breakpoints.up("sm")]: {
        fontSize: "1rem",
      },
      [createTheme().breakpoints.up("md")]: {
        fontSize: "1.1rem",
      },
      [createTheme().breakpoints.up("lg")]: {
        fontSize: "1.2rem",
      },
      [createTheme().breakpoints.up("xl")]: {
        fontSize: "1.3rem",
      },
    },
    body2: {
      fontSize: "0.75rem", // Default for xs
      [createTheme().breakpoints.up("sm")]: {
        fontSize: "0.875rem",
      },
      [createTheme().breakpoints.up("md")]: {
        fontSize: "1rem",
      },
      [createTheme().breakpoints.up("lg")]: {
        fontSize: "1.1rem",
      },
      [createTheme().breakpoints.up("xl")]: {
        fontSize: "1.2rem",
      },
    },
    caption: {
      fontSize: "0.6rem", // Default for xs
      [createTheme().breakpoints.up("sm")]: {
        fontSize: "0.65rem",
      },
      [createTheme().breakpoints.up("md")]: {
        fontSize: "0.7rem",
      },
      [createTheme().breakpoints.up("lg")]: {
        fontSize: "0.75rem",
      },
      [createTheme().breakpoints.up("xl")]: {
        fontSize: "0.8rem",
      },
    },
  },
  iconSizes: {
    small: {
      xs: "10px",
      sm: "15px",
      md: "20px",
      lg: "25px",
      xl: "30px",
    },
    medium: {
      xs: "16px",
      sm: "18px",
      md: "20px",
      lg: "22px",
      xl: "24px",
    },
    large: {
      xs: "20px",
      sm: "24px",
      md: "28px",
      lg: "32px",
      xl: "36px",
    },
    xl: {
      xs: "24px",
      sm: "28px",
      md: "32px",
      lg: "36px",
      xl: "40px",
    },
  },
  cssVariables: true,
  palette: {
    mode: "light",
    primary: {
      main: "#7B7B7B", // Dark grey (Default color)
    },
    secondary: {
      main: "#05486C", // Dark Blue (Selected)
    },
    error: {
      main: "#f44336", // Red
    },
    success: {
      main: "#4caf50", // Green
    },
    background: {
      default: "#C5C5C5", // Light Grey
    },
    text: {
      primary: "#000000", // Black
      secondary: "#ffffff", // White
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: "#05486C", // Dark Blue
          color: "#ffffff", // White text
          "&:hover": {
            backgroundColor: "#043152", // Darker Blue on hover
          },
        },
        containedSecondary: {
          backgroundColor: "#CBC9C9", // Light Grey
          color: "#000000", // Black text
          "&:hover": {
            backgroundColor: "#a30034", // Darker Pink on hover
          },
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: "#7B7B7B", // Default Grey
          "&.MuiStepIcon-active": {
            color: "#05486C", // Dark Blue when active
          },
          "&.MuiStepIcon-completed": {
            color: "#4caf50", // Green when completed
          },
          "&.MuiStepIcon-error": {
            color: "#f44336", // Red when error
          },
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          "&.Mui-active": {
            color: "rgba(0, 0, 0, 0.54)",
          },
          "&.MuiStepLabel-active": {
            color: "#05486C !important", // Dark Blue when active
          },
          "&.MuiStepLabel-completed": {
            color: "#4caf50 !important", // Green when completed
          },
          "&.MuiStepLabel-error": {
            color: "#f44336 !important", // Red when error
          },
          color: "#7B7B7B", // Default Grey
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF", // Background color white
          border: "3px solid #BEBCBC", // Stroke color
          color: "#000000", // Text color black
          "&::placeholder": {
            color: "#BCBABA", // Placeholder color
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#05486C", // Dark Blue background
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          color: "#ffffff", // White text
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#ffffff", // White icon buttons
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#ffffff", // White text
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#ffffff", // White links
        },
      },
    },
  },
});
export default theme;
