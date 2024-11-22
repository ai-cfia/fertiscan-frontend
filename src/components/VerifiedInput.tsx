import CheckIcon from "@mui/icons-material/Check";
import {
  Box,
  Divider,
  IconButton,
  InputBase,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

function VerifiedInput({
  label,
  placeholder,
  path,
  className = "",
}: {
  label: string;
  placeholder: string;
  path: string;
  className?: string;
}) {
  const { control } = useFormContext();
  const [isFocused, setIsFocused] = useState(false);
  const valuePath = `${path}.value`;
  const verifiedPath = `${path}.verified`;

  const verified: boolean = useWatch({
    control,
    name: verifiedPath,
  });

  return (
    <Box
      className={`flex items-center p-1 w-full border-2 rounded-tr-md rounded-br-md ${
        isFocused ? "border-fertiscan-blue" : ""
      } ${className}`}
      data-testid={`verified-input-${valuePath}`}
    >
      <Typography
        className="px-2 !font-bold select-none"
        data-testid={`input-label-${valuePath}`}
      >
        {label}
      </Typography>
      <Controller
        name={valuePath}
        control={control}
        render={({ field }) => (
          <InputBase
            {...field}
            className="ml-2 flex-1 !text-[15px]"
            placeholder={placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false);
              field.onChange(e.target.value.trim());
            }}
            disabled={verified}
            data-testid={`input-field-${valuePath}`}
          />
        )}
      />
      <Divider
        orientation="vertical"
        flexItem
        className={isFocused ? "!border-fertiscan-blue" : ""}
        data-testid={`divider-${valuePath}`}
      />
      <Controller
        name={verifiedPath}
        control={control}
        render={({ field: { value, onChange } }) => (
          <Tooltip
            title={verified ? "Mark as Unverified" : "Mark as Verified"}
            enterDelay={1000}
          >
            <IconButton
              onClick={() => onChange(!value)}
              data-testid={`toggle-verified-btn-${verifiedPath}`}
            >
              <CheckIcon
                className={value ? "text-green-500" : ""}
                data-testid={`verified-icon-${verifiedPath}`}
              />
            </IconButton>
          </Tooltip>
        )}
      />
    </Box>
  );
}

export default VerifiedInput;
