import CheckIcon from "@mui/icons-material/Check";
import { Box, Divider, IconButton, InputBase, Typography } from "@mui/material";
import React, { useState } from "react";

interface CheckedInputProps {
  label: string;
  placeholder: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

const CheckedInput: React.FC<CheckedInputProps> = ({
  label,
  placeholder,
  value,
  setValue,
  isChecked,
  setIsChecked,
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);

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
        disabled={isChecked}
      />

      <Divider
        orientation="vertical"
        flexItem
        className={isFocused ? "!border-fertiscan-blue" : ""}
      />

      <IconButton onClick={() => setIsChecked(!isChecked)}>
        <CheckIcon className={isChecked ? "text-green-500" : ""} />
      </IconButton>
    </Box>
  );
};

export default CheckedInput;
