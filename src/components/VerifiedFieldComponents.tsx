import CheckIcon from "@mui/icons-material/Check";
import {
  Box,
  Divider,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { ReactNode, useState } from "react";
import { Control, Controller, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import StyledSkeleton from "./StyledSkeleton";
import StyledTextField from "./StyledTextField";

interface VerifiedFieldWrapperProps {
  label: string;
  path: string;
  className?: string;
  loading?: boolean;
  renderField: (props: {
    setIsFocused: (value: boolean) => void;
    control: Control;
    valuePath: string;
    verified: boolean;
  }) => ReactNode;
}

export const VerifiedFieldWrapper: React.FC<VerifiedFieldWrapperProps> = ({
  label,
  path,
  className = "",
  loading = false,
  renderField,
}) => {
  const { t } = useTranslation("labelDataValidator");
  const { control } = useFormContext();
  const [isFocused, setIsFocused] = useState(false);

  const valuePath = `${path}.value`;
  const verifiedPath = `${path}.verified`;
  const verified: boolean = useWatch({
    control,
    name: verifiedPath,
  });

  return (
    <Box>
      <Typography
        className="px-2 !font-bold select-none text-left"
        data-testid={`field-label-${path}`}
      >
        {label}
      </Typography>

      {loading ? (
        <StyledSkeleton />
      ) : (
        <Box
          className={`flex items-center p-1 border-2 rounded-tr-md rounded-br-md ${
            isFocused ? "border-fertiscan-blue" : ""
          } ${verified ? "border-green-500 bg-gray-300 border-2" : "border-2"} ${className}`}
          data-testid={`verified-field-${path}`}
        >
          {renderField({ setIsFocused, control, valuePath, verified })}
          <Divider
            orientation="vertical"
            flexItem
            className={isFocused ? "!border-fertiscan-blue" : ""}
            sx={{
              bgcolor: verified ? "#00C55E" : "inherit",
            }}
            data-testid={`divider-${path}`}
          />
          <Controller
            name={verifiedPath}
            control={control}
            render={({ field: { value, onChange } }) => (
              <Tooltip
                title={
                  verified
                  ? t("verifiedInput.unverify", { label })
                  : t("verifiedInput.verify", { label })
                }
                enterDelay={1000}
              >
                <IconButton
                  onClick={() => onChange(!value)}
                  data-testid={`toggle-verified-btn-${verifiedPath}`}
                  aria-label={
                    verified
                    ? t("verifiedInput.unverify", { label })
                    : t("verifiedInput.verify", { label })
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
      )}
    </Box>
  );
};

interface VerifiedRadioProps {
  label: string;
  path: string;
  className?: string;
  loading?: boolean;
}

export const VerifiedRadio: React.FC<VerifiedRadioProps> = ({
  label,
  path,
  className = "",
  loading = false,
}) => {
  const { t } = useTranslation("labelDataValidator");
  return (
    <VerifiedFieldWrapper
      label={label}
      path={path}
      className={className}
      loading={loading}
      renderField={({ setIsFocused, control, valuePath, verified }) => (
        <Controller
          name={valuePath}
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value ? "yes" : "no"}
              onChange={(e) => field.onChange(e.target.value === "yes")}
              className="flex-1 !flex-row px-2 "
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              data-testid={`radio-group-field-${valuePath}`}
              aria-label={`${t("verifiedInput.accessibility.radioGroup", { label })}`}
            >
              <FormControlLabel
                value="yes"
                control={<Radio size="small" />}
                label={
                  <Typography className="!text-[15px]">
                    {t("verifiedInput.options.yes")}
                  </Typography>
                }
                disabled={verified}
                data-testid={`radio-yes-field-${valuePath}`}
              />
              <FormControlLabel
                value="no"
                control={<Radio size="small" />}
                label={
                  <Typography className="!text-[15px]">
                    {t("verifiedInput.options.no")}
                  </Typography>
                }
                disabled={verified}
                data-testid={`radio-no-field-${valuePath}`}
              />
            </RadioGroup>
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
  loading?: boolean;
}

export const VerifiedInput: React.FC<VerifiedInputProps> = ({
  label,
  placeholder,
  path,
  className = "",
  loading = false,
}) => {
  const { t } = useTranslation("labelDataValidator");
  return (
    <VerifiedFieldWrapper
      label={label}
      path={path}
      className={className}
      loading={loading}
      renderField={({ setIsFocused, control, valuePath, verified }) => (
        <Controller
          name={valuePath}
          control={control}
          render={({ field }) => (
            <StyledTextField
              {...field}
              placeholder={placeholder}
              className="!ml-2 !text-[15px]"
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
