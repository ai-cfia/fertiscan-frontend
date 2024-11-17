import { FieldStatus } from "@/types/Field";
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
    currentStatus: FieldStatus,
    setStatus: (value: FieldStatus) => void,
  ) => {
    if (currentStatus !== FieldStatus.Error) {
      setStatus(
        currentStatus === FieldStatus.Verified
          ? FieldStatus.Unverified
          : FieldStatus.Verified,
      );
    }
  };

  const tooltipText =
    statusValue === FieldStatus.Verified
      ? "Mark as Unverified"
      : "Mark as Verified";

  return (
    <Box
      className={`flex items-center p-1 w-full border-2 rounded-tr-md rounded-br-md ${
        isFocused ? "border-fertiscan-blue" : ""
      } ${className}`}
      data-testid={`input-with-status-${name}`}
    >
      <Typography
        className="px-2 !font-bold select-none"
        data-testid={`input-label-${name}`}
      >
        {label}
      </Typography>
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
            disabled={statusValue === FieldStatus.Verified}
            data-testid={`input-field-${name}`}
          />
        )}
      />
      <Divider
        orientation="vertical"
        flexItem
        className={isFocused ? "!border-fertiscan-blue" : ""}
        data-testid={`divider-${name}`}
      />
      <Controller
        name={statusName}
        control={control}
        render={({ field: { value, onChange } }) => (
          <Tooltip title={tooltipText} enterDelay={1000}>
            <IconButton
              onClick={() => toggleVerified(value, onChange)}
              data-testid={`toggle-status-btn-${statusName}`}
            >
              <CheckIcon
                className={
                  value === FieldStatus.Verified ? "text-green-500" : ""
                }
                data-testid={`status-icon-${statusName}`}
              />
            </IconButton>
          </Tooltip>
        )}
      />
    </Box>
  );
}

export default InputWithStatus;
