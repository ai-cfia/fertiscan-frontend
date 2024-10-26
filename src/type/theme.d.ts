import "@mui/material/styles";
import { ResponsiveStyleValue } from "@mui/system";

/**
 * Extending Material-UI Theme
 *
 * This module extends the default Material-UI theme to include custom properties
 * for icon sizes and logo sizes, adding more flexibility and consistency in styling.
 */

declare module "@mui/material/styles" {
  interface Theme {
    // Custom sizes for logo, defined by responsive width and height
    logoSizes: {
      width: ResponsiveStyleValue<string | number>;
      height: ResponsiveStyleValue<string | number>;
    };
  }

  interface ThemeOptions {
    // Optional custom sizes for logo, with partial responsive width and height
    logoSizes?: {
      width?: ResponsiveStyleValue<string | number>;
      height?: ResponsiveStyleValue<string | number>;
    };
  }
}
