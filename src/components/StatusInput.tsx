import CheckIcon from "@mui/icons-material/Check";
import { Box, Divider, IconButton, InputBase, Typography } from "@mui/material";
import React, { useState } from "react";
import { FieldStatus } from "./OrganizationInformation";

function StatusInput({
  label,
  placeholder,
  value,
  setValue,
  status,
  setStatus,
  className = "",
}: {
  label: string;
  placeholder: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  status: FieldStatus;
  setStatus: React.Dispatch<React.SetStateAction<FieldStatus>>;
  // errorMessage: string | null;
  // setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  className?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);

  const toggleVerified = () => {
    if (status !== FieldStatus.Error) {
      setStatus(
        status === FieldStatus.Verified
          ? FieldStatus.Unverified
          : FieldStatus.Verified,
      );
    }
  };

  return (
    <Box
      className={`flex items-center p-1 w-full border-2 rounded-tr-md rounded-br-md ${isFocused ? "border-fertiscan-blue" : ""} ${className}`}
    >
      <Typography className="px-2 !font-bold select-none">{label}</Typography>

      <InputBase
        className="ml-2 flex-1 !text-[15px]"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={status === FieldStatus.Verified}
      />

      <Divider
        orientation="vertical"
        flexItem
        className={isFocused ? "!border-fertiscan-blue" : ""}
      />

      <IconButton onClick={toggleVerified}>
        <CheckIcon
          className={status === FieldStatus.Verified ? "text-green-500" : ""}
        />
      </IconButton>
    </Box>
  );
}

export default StatusInput;
