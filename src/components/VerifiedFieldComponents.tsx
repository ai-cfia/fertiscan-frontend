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
import { ReactNode, useEffect, useRef, useState } from "react";
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
  const [iconFocus, setIconFocus] = useState(false);

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
          className={`flex items-center rounded-br-md rounded-tr-md border-2 p-1 ${
            isFocused ? "border-fertiscan-blue" : "border-[#e5e7eb]"
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
                  onFocus={() => {
                    setIconFocus(!iconFocus);
                    setIsFocused(true);
                  }}
                  onBlur={() => {
                    setIconFocus(!iconFocus);
                    setIsFocused(false);
                  }}
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
                      className={`${value ? "text-green-500" : ""} ${
                        iconFocus ? "font-bold text-fertiscan-blue" : ""
                      } `}
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
  isFocus?: boolean;
}

export const VerifiedRadio: React.FC<VerifiedRadioProps> = ({
  label,
  path,
  className = "",
  loading = false,
  isHelpActive = false,
  helpText,
  isFocus = false,
}) => {
  const { t } = useTranslation("labelDataValidator");
  const [hoverHelp, setHoverHelp] = useState(false);
  const radioGroupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFocus && radioGroupRef.current) {
      radioGroupRef.current.focus();
    }
  }, [isFocus]);

  return (
    <VerifiedFieldWrapper
      label={
        <Box className="flex items-start">
          <Typography
            className="select-none pl-2 text-left !font-bold"
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
                      className="-mb-4 -mt-2"
                      style={{ fontSize: "20" }}
                    />
                  ) : (
                    <HelpOutlineIcon
                      className="-mb-4 -mt-2"
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
              ref={radioGroupRef}
              tabIndex={0}
              value={field.value ? "yes" : "no"}
              onChange={(e) => field.onChange(e.target.value === "yes")}
              className="flex-1 !flex-row px-2"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              data-testid={`radio-group-field-${valuePath}`}
              aria-label={`${t("verifiedInput.accessibility.radioGroup", { label })}`}
            >
              <FormControlLabel
                value="yes"
                control={<Radio size="small" />}
                label={
                  <Typography className="select-none !text-[15px]">
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
                  <Typography className="select-none !text-[15px]">
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
  isFocus?: boolean;
}

export const VerifiedInput: React.FC<VerifiedInputProps> = ({
  label,
  placeholder,
  path,
  className = "",
  loading = false,
  isFocus = false,
}) => {
  const { t } = useTranslation("labelDataValidator");

  return (
    <VerifiedFieldWrapper
      label={
        <Typography
          className="select-none px-2 text-left !font-bold"
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
              autoFocus={isFocus}
            />
          )}
        />
      )}
    />
  );
};
