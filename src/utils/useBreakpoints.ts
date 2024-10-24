import { useTheme, useMediaQuery } from "@mui/material";
import { Breakpoints } from "@/type/breakpoints"; // Update the import path as necessary

const useBreakpoints = (): Breakpoints => {
  const theme = useTheme();
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));
  const isSmall = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const isMedium = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLarge = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isExtraLarge = useMediaQuery(theme.breakpoints.up("lg"));

  return { isExtraSmall, isSmall, isMedium, isLarge, isExtraLarge };
};

export default useBreakpoints;
