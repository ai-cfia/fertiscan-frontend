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
        placeholder={props.placeholder}
        autoComplete="off"
        autoFocus={props.autoFocus}
        slotProps={{
          ...props.slotProps,
          input: {
            ...props.slotProps?.input,
            disableUnderline: true,
            className: "!text-[15px]",
          },
        }}
        focused={props.focused}
      />
    );
  },
);

StyledTextField.displayName = "StyledTextField";

export default StyledTextField;
