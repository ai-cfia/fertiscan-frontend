import { Theme } from "@mui/material/styles";
import { Breakpoints } from "@/type/breakpoints";

// Utility function to get size
export const getSize = (
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
  if (isExtraSmall) return theme.iconSizes[size].xs;
  return theme.iconSizes[size].xs;
};
