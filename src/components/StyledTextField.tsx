import { TextField, TextFieldProps } from "@mui/material";
import React from "react";

const StyledTextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (props, ref) => {
    return (
      <TextField
        {...props}
        ref={ref}
        variant="standard"
        fullWidth
        autoComplete="off"
        slotProps={{
          ...props.slotProps,
          input: {
            ...props.slotProps?.input,
            disableUnderline: true,
            className: "!text-[15px]",
          },
        }}
      />
    );
  },
);

StyledTextField.displayName = "StyledTextField";

export default StyledTextField;
