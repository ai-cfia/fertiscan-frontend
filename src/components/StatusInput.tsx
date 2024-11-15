import CheckIcon from "@mui/icons-material/Check";
import { Box, Divider, IconButton, InputBase, Typography } from "@mui/material";
import { useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

export enum InputStatus {
  Verified = "verified",
  Unverified = "unverified",
  Error = "error",
}

function InputWithStatus({
  label,
  placeholder,
  name,
  statusName,
  className = "",
}: {
  label: string;
  placeholder: string;
  name: string;
  statusName: string;
  className?: string;
}) {
  const { control } = useFormContext();
  const [isFocused, setIsFocused] = useState(false);

  const statusValue = useWatch({
    control,
    name: statusName,
  });

  const toggleVerified = (
    currentStatus: InputStatus,
    setStatus: (value: InputStatus) => void,
  ) => {
    if (currentStatus !== InputStatus.Error) {
      setStatus(
        currentStatus === InputStatus.Verified
          ? InputStatus.Unverified
          : InputStatus.Verified,
      );
    }
  };

  return (
    <Box
      className={`flex items-center p-1 w-full border-2 rounded-tr-md rounded-br-md ${
        isFocused ? "border-fertiscan-blue" : ""
      } ${className}`}
    >
      <Typography className="px-2 !font-bold select-none">{label}</Typography>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <InputBase
            {...field}
            className="ml-2 flex-1 !text-[15px]"
            placeholder={placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={statusValue === InputStatus.Verified}
          />
        )}
      />
      <Divider
        orientation="vertical"
        flexItem
        className={isFocused ? "!border-fertiscan-blue" : ""}
      />
      <Controller
        name={statusName}
        control={control}
        render={({ field: { value, onChange } }) => (
          <IconButton onClick={() => toggleVerified(value, onChange)}>
            <CheckIcon
              className={value === InputStatus.Verified ? "text-green-500" : ""}
            />
          </IconButton>
        )}
      />
    </Box>
  );
}

export default InputWithStatus;
