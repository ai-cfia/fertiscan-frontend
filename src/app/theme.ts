import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  logoSizes: {
    width: {
      xs: "40vw",
      sm: "35vw",
      md: "30vw",
      lg: "25vw",
      xl: "20vw",
    },
    height: {
      xs: "100%",
      sm: "90%",
      md: "80%",
      lg: "70%",
      xl: "50%",
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
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          containedPrimary: {
            textTransform: "none", // No text transformation
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
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: "38px", // Larger icon size
        },
      },
    },
  },
});
export default theme;
