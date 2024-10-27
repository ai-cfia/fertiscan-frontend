import { useTheme, useMediaQuery } from "@mui/material";
import { Breakpoints } from "@/type/breakpoints";

/**
 * Custom Hook: useBreakpoints
 *
 * This custom hook utilizes Material-UI's theme and media queries to determine the current screen size
 * and returns an object indicating which breakpoint range the screen size falls into.
 *
 * @returns {Breakpoints} An object with boolean values for each breakpoint range.
 */
const useBreakpoints = (): Breakpoints => {
  const theme = useTheme();

  // Determine what is the screen size based on the theme breakpoints
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));
  const isSmall = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const isMedium = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLarge = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isExtraLarge = useMediaQuery(theme.breakpoints.up("lg"));

  return { isExtraSmall, isSmall, isMedium, isLarge, isExtraLarge };
};

export default useBreakpoints;
