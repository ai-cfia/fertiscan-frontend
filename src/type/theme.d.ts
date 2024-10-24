import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    iconSizes: {
      small: SizeVariant;
      medium: SizeVariant;
      large: SizeVariant;
      xl: SizeVariant;
    };
    logoSizes: {
      width: SizeVariant;
      height: SizeVariant;
    };
  }

  interface ThemeOptions {
    iconSizes?: {
      small?: Partial<SizeVariant>;
      medium?: Partial<SizeVariant>;
      large?: Partial<SizeVariant>;
      xl?: Partial<SizeVariant>;
    };
    logoSizes?: {
      width?: Partial<SizeVariant>;
      height?: Partial<SizeVariant>;
    };
  }

  interface SizeVariant {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  }
}
