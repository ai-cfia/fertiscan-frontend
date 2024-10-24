import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    iconSizes: {
      small: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
      };
      medium: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
      };
      large: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
      };
      xl: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
      };
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    iconSizes?: {
      small?: {
        xs?: string;
        sm?: string;
        md?: string;
        lg?: string;
        xl?: string;
      };
      medium?: {
        xs?: string;
        sm?: string;
        md?: string;
        lg?: string;
        xl?: string;
      };
      large?: {
        xs?: string;
        sm?: string;
        md?: string;
        lg?: string;
        xl?: string;
      };
      xl?: {
        xs?: string;
        sm?: string;
        md?: string;
        lg?: string;
        xl?: string;
      };
    };
  }
}
