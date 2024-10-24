import "@mui/material/styles";

/**
 * Extending Material-UI Theme
 *
 * This module extends the default Material-UI theme to include custom properties
 * for icon sizes and logo sizes, adding more flexibility and consistency in styling.
 */

declare module "@mui/material/styles" {
  interface Theme {
    // Custom sizes for icons, based on different size variants
    iconSizes: {
      xs: SizeVariant;
      small: SizeVariant;
      medium: SizeVariant;
      large: SizeVariant;
      xl: SizeVariant;
    };

    // Custom sizes for logo, defined by width and height variants
    logoSizes: {
      width: SizeVariant;
      height: SizeVariant;
    };
  }

  interface ThemeOptions {
    // Optional custom sizes for icons, with partial size variants
    iconSizes?: {
      xs?: Partial<SizeVariant>;
      small?: Partial<SizeVariant>;
      medium?: Partial<SizeVariant>;
      large?: Partial<SizeVariant>;
      xl?: Partial<SizeVariant>;
    };

    // Optional custom sizes for logo, with partial size variants for width and height
    logoSizes?: {
      width?: Partial<SizeVariant>;
      height?: Partial<SizeVariant>;
    };
  }

  interface SizeVariant {
    // Size for extra small screens
    xs: string;

    // Size for small screens
    sm: string;

    // Size for medium screens
    md: string;

    // Size for large screens
    lg: string;

    // Size for extra large screens
    xl: string;
  }
}
