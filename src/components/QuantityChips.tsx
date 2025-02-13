import { Quantity } from "@/types/types";
import { Box, Chip } from "@mui/material";
import React from "react";

export interface QuantityChipsProps extends React.ComponentProps<typeof Box> {
  quantities: Quantity[] | undefined;
}

export const QuantityChips = React.forwardRef<
  HTMLDivElement,
  QuantityChipsProps
>(({ quantities, ...rest }, ref) => {
  return (
    <Box
      {...rest}
      ref={ref}
      className={`flex flex-wrap gap-1 ${rest.className || ""}`}
    >
      {quantities
        ?.filter((q) => q.value)
        .map((q, i) => (
          <Chip key={i} label={`${q.value} ${q.unit}`} variant="outlined" />
        ))}
    </Box>
  );
});

QuantityChips.displayName = "QuantityChips";
