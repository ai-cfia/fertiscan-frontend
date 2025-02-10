import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, IconButtonProps, Tooltip } from "@mui/material";
import React from "react";

interface StyledDeleteButtonProps extends IconButtonProps {
  tooltip: string;
  tooltipDelay?: number;
  hideButton?: boolean;
}

const StyledDeleteButton = React.forwardRef<
  HTMLButtonElement,
  StyledDeleteButtonProps
>(
  (
    {
      tooltip: tooltipTitle,
      tooltipDelay: enterDelay = 1000,
      hideButton,
      ...props
    },
    ref,
  ) => {
    if (hideButton) return null;

    return (
      <Tooltip enterDelay={enterDelay} title={tooltipTitle}>
        <IconButton ref={ref} {...props} size="small" className="text-white">
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    );
  },
);

export default StyledDeleteButton;
