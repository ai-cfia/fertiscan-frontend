import CheckIcon from "@mui/icons-material/Check";
import {
  Box,
  Checkbox,
  Divider,
  IconButton,
  InputBase,
  Tooltip,
  Typography,
} from "@mui/material";
import { ReactNode, useState } from "react";
import { Control, Controller, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface VerifiedFieldWrapperProps {
  label: string;
  path: string;
  className?: string;
  renderField: (props: {
    setIsFocused: (value: boolean) => void;
    control: Control;
    valuePath: string;
    verified: boolean;
  }) => ReactNode;
}

const VerifiedFieldWrapper: React.FC<VerifiedFieldWrapperProps> = ({
  label,
  path,
  className = "",
  renderField,
}) => {
  const { t } = useTranslation("labelDataValidationPage");
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
      className={`flex items-center p-1 border-2 rounded-tr-md rounded-br-md ${
        isFocused ? "border-fertiscan-blue" : ""
      } ${className}`}
      data-testid={`verified-field-${path}`}
    >
      <Typography
        className="px-2 !font-bold select-none"
        data-testid={`field-label-${path}`}
      >
        {label}
      </Typography>
      {renderField({ setIsFocused, control, valuePath, verified })}
      <Divider
        orientation="vertical"
        flexItem
        className={isFocused ? "!border-fertiscan-blue" : ""}
        data-testid={`divider-${path}`}
      />
      <Controller
        name={verifiedPath}
        control={control}
        render={({ field: { value, onChange } }) => (
          <Tooltip
            title={
              verified
                ? t("verifiedField.unverify", { label })
                : t("verifiedField.verify", { label })
            }
            enterDelay={1000}
          >
            <IconButton
              onClick={() => onChange(!value)}
              data-testid={`toggle-verified-btn-${verifiedPath}`}
              aria-label={
                verified
                  ? t("verifiedField.unverify", { label })
                  : t("verifiedField.verify", { label })
              }
            >
              <CheckIcon
                className={value ? "text-green-500" : ""}
                data-testid={`verified-icon-${verifiedPath}`}
                aria-hidden
              />
            </IconButton>
          </Tooltip>
        )}
      />
    </Box>
  );
};

interface VerifiedCheckboxProps {
  label: string;
  path: string;
  className?: string;
}

const VerifiedCheckbox: React.FC<VerifiedCheckboxProps> = ({
  label,
  path,
  className = "",
}) => {
  const { t } = useTranslation("labelDataValidationPage");
  return (
    <VerifiedFieldWrapper
      label={label}
      path={path}
      className={className}
      renderField={({ setIsFocused, control, valuePath, verified }) => (
        <Controller
          name={valuePath}
          control={control}
          render={({ field }) => (
            <Checkbox
              {...field}
              checked={field.value}
              disabled={verified}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              data-testid={`checkbox-field-${valuePath}`}
              aria-label={`${t("verifiedInput.accessibility.checkbox", { label })}`}
            />
          )}
        />
      )}
    />
  );
};

interface VerifiedInputProps {
  label: string;
  placeholder: string;
  path: string;
  className?: string;
}

const VerifiedInput: React.FC<VerifiedInputProps> = ({
  label,
  placeholder,
  path,
  className = "",
}) => {
  const { t } = useTranslation("labelDataValidationPage");
  return (
    <VerifiedFieldWrapper
      label={label}
      path={path}
      className={className}
      renderField={({ setIsFocused, control, valuePath, verified }) => (
        <Controller
          name={valuePath}
          control={control}
          render={({ field }) => (
            <InputBase
              {...field}
              placeholder={placeholder}
              className="ml-2 flex-1 !text-[15px]"
              disabled={verified}
              onFocus={() => setIsFocused(true)}
              onBlur={(e) => {
                setIsFocused(false);
                field.onChange(e.target.value.trim());
              }}
              data-testid={`input-field-${valuePath}`}
              aria-label={`${t("verifiedInput.accessibility.input", { label })}`}
            />
          )}
        />
      )}
    />
  );
};

export { VerifiedCheckbox, VerifiedInput };
