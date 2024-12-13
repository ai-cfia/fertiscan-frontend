import { Autocomplete, AutocompleteProps } from "@mui/material";
import React from "react";

const StyledAutocomplete = React.forwardRef<
  HTMLInputElement,
  AutocompleteProps<string, boolean, boolean, boolean>
>((props, ref) => {
  return (
    <Autocomplete
      ref={ref}
      disableClearable
      freeSolo
      selectOnFocus
      slotProps={{
        popper: {
          className: "!w-fit",
        },
      }}
      {...props}
    />
  );
});

StyledAutocomplete.displayName = "StyledAutoComplete";

export default StyledAutocomplete;
