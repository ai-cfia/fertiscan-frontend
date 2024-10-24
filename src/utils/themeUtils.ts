import { Theme } from "@mui/material/styles";
import { Breakpoints } from "@/type/breakpoints";

/**
 * Utility Function: getSize
 *
 * This utility function determines the appropriate size value based on the current screen size,
 * provided size category, and the theme's size variants for icons. It utilizes the breakpoints
 * to select the correct size variant for the current screen size.
 *
 * @param {Theme} theme - The Material-UI theme object which contains the icon size variants.
 * @param {"small" | "medium" | "large" | "xl"} size - The size category (small, medium, large, xl) for which the size value is needed.
 * @param {Breakpoints} breakpoints - An object representing the current screen size breakpoints.
 * @returns {string} - The size value for the given category and screen size.
 */
export const getSize = (
  theme: Theme,
  size: "xs" | "small" | "medium" | "large" | "xl",
  breakpoints: Breakpoints,
): string => {
  if (!theme.iconSizes || !theme.iconSizes[size]) {
    console.error("Icon sizes not defined in theme for size:", size);
    return "1rem";
  }

  const { isExtraSmall, isSmall, isMedium, isLarge, isExtraLarge } =
    breakpoints;

  // Determine the size value to return based on the current screen size
  if (isExtraLarge && theme.iconSizes[size].xl) return theme.iconSizes[size].xl;
  if (isLarge && theme.iconSizes[size].lg) return theme.iconSizes[size].lg;
  if (isMedium && theme.iconSizes[size].md) return theme.iconSizes[size].md;
  if (isSmall && theme.iconSizes[size].sm) return theme.iconSizes[size].sm;
  if (isExtraSmall && theme.iconSizes[size].xs) return theme.iconSizes[size].xs;

  // As a fallback, return the extra-small size or a default if not available
  return theme.iconSizes[size].xs || "1rem";
};
