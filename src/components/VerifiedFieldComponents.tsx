import CheckIcon from "@mui/icons-material/Check";
import HelpIcon from "@mui/icons-material/Help";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  Box,
  Divider,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  SvgIcon,
  Tooltip,
  Typography,
} from "@mui/material";
import { ReactNode, useState } from "react";
import { Control, Controller, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import StyledSkeleton from "./StyledSkeleton";
import StyledTextField from "./StyledTextField";

interface VerifiedFieldWrapperProps {
  label: ReactNode;
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
  const [hover, setHover] = useState(false);

  const valuePath = `${path}.value`;
  const verifiedPath = `${path}.verified`;
  const verified: boolean = useWatch({
    control,
    name: verifiedPath,
  });

  return (
    <Box>
      <>{label}</>
      {loading ? (
        <StyledSkeleton />
      ) : (
        <Box
          className={`flex items-center p-1 border-2 rounded-tr-md rounded-br-md ${
            isFocused ? "border-fertiscan-blue" : ""
          } ${verified ? "border-green-500 bg-gray-300" : ""} ${className}`}
          data-testid={`verified-field-${path}`}
        >
          {renderField({ setIsFocused, control, valuePath, verified })}
          <Divider
            orientation="vertical"
            flexItem
            className={isFocused ? "!border-fertiscan-blue" : ""}
            sx={{ bgcolor: verified ? "#00C55E" : "inherit" }}
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
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                >
                  {hover && verified ? (
                    <SvgIcon aria-hidden>
                      <image
                        href="/img/unverifyIcon.svg"
                        height="24"
                        width="24"
                      />
                    </SvgIcon>
                  ) : (
                    <CheckIcon
                      className={value ? "text-green-500" : ""}
                      data-testid={`verified-icon-${verifiedPath}`}
                      aria-hidden
                    />
                  )}
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
  isHelpActive?: boolean;
  helpText?: string;
}

export const VerifiedRadio: React.FC<VerifiedRadioProps> = ({
  label,
  path,
  className = "",
  loading = false,
  isHelpActive = false,
  helpText,
}) => {
  const { t } = useTranslation("labelDataValidator");
  const [hoverHelp, setHoverHelp] = useState(false);
  return (
    <VerifiedFieldWrapper
      label={
        <Box className="flex items-start">
          <Typography
            className="!font-bold select-none text-left pl-2"
            data-testid={`field-label-${path}`}
          >
            {label}
          </Typography>
          {isHelpActive && (
            <>
              <Tooltip title={helpText}>
                <IconButton
                  aria-label="help"
                  onMouseEnter={() => setHoverHelp(true)}
                  onMouseLeave={() => setHoverHelp(false)}
                  className="!bg-transparent p-0"
                >
                  {hoverHelp ? (
                    <HelpIcon
                      className="-mt-2 -mb-4"
                      style={{ fontSize: "20" }}
                    />
                  ) : (
                    <HelpOutlineIcon
                      className="-mt-2 -mb-4"
                      style={{ fontSize: "20" }}
                    />
                  )}
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      }
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
              data-testid={`radio-group-field-${valuePath}`}
              aria-label={`${t("verifiedInput.accessibility.radioGroup", { label })}`}
            >
              <FormControlLabel
                value="yes"
                control={<Radio size="small" />}
                label={
                  <Typography className="!text-[15px] select-none">
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
                  <Typography className="!text-[15px] select-none">
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
      label={
        <Typography
          className="!font-bold select-none text-left px-2"
          data-testid={`field-label-${path}`}
        >
          {label}
        </Typography>
      }
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
                if (field.value.trim() !== e.target.value.trim()) {
                  field.onChange(e.target.value.trim());
                }
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
