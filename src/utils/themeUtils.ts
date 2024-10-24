import { Theme } from "@mui/material/styles";
import { Breakpoints } from "@/type/breakpoints"; // Update the import path as necessary

// Utility function to get icon size
export const getIconSize = (
  theme: Theme,
  size: "small" | "medium" | "large" | "xl",
  breakpoints: Breakpoints,
): string => {
  const { isExtraSmall, isSmall, isMedium, isLarge, isExtraLarge } =
    breakpoints;

  if (isExtraLarge) return theme.iconSizes[size].xl;
  if (isLarge) return theme.iconSizes[size].lg;
  if (isMedium) return theme.iconSizes[size].md;
  if (isSmall) return theme.iconSizes[size].sm;
  return theme.iconSizes[size].xs;
};
