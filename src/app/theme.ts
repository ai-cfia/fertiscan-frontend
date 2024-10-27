import { createTheme } from "@mui/material/styles";

const theme = createTheme({
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
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  logoSize: {
    width: {
      xs: "290px",
      sm: "390px",
      md: "512px",
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          containedPrimary: {
            textTransform: "none",
            backgroundColor: "#05486C", // Dark Blue
            color: "#ffffff", // White text
            "&:hover": {
              backgroundColor: "#032f47", // Darker Blue on hover
            },
          },
          containedSecondary: {
            textTransform: "none",
            backgroundColor: "#CBC9C9", // Light Grey
            color: "#000000", // Black text
            "&:hover": {
              backgroundColor: "#032f47", // Darker grey on hover
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#ffffff", // White icon buttons
          "&:hover": {
            backgroundColor: "#053f5e", // Dark Blue on hover
            color: "#000000", // Black text
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
          height: "64px", // Height of the AppBar
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
