import CheckIcon from "@mui/icons-material/Check";
import {
  Box,
  colors,
  Divider,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { ReactNode, SetStateAction, useState } from "react";
import { Control, Controller, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import StyledTextField from "./StyledTextField";
import json from '@/app/TestImagePage/test.json'; //testing purposes

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

export const VerifiedFieldWrapper: React.FC<VerifiedFieldWrapperProps> = ({
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
    <Box>
      <Typography
        className="px-2 !font-bold select-none text-left"
        data-testid={`field-label-${path}`}
      >
        {label}
      </Typography>

      <Box
        className={`flex items-center p-1 border-2 rounded-tr-md rounded-br-md ${
          isFocused ? "border-fertiscan-blue" : ""
        } ${verified ? "border-green-500" : ""} ${className}`}
        data-testid={`verified-field-${path}`}
      >
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
    </Box>
  );
};

interface VerifiedRadioProps {
  label: string;
  path: string;
  className?: string;
}

export const VerifiedRadio: React.FC<VerifiedRadioProps> = ({
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
  handleHoveredTextChange: (text: string | null) => void; // Ajouté
  className?: string;
}

const searchSuggestions = (input: string, data: any[]) => {
  if (input.length < 4) return []; // Must wait for at least 4 characters
  const lowerInput = input.toLowerCase();

  return data
    .filter(paragraph => paragraph.content.toLowerCase().includes(lowerInput))
    .slice(0, 5)
    .map(paragraph => paragraph.content);
};

export const VerifiedInput: React.FC<VerifiedInputProps> = ({
  label,
  placeholder,
  path,
  handleHoveredTextChange,
  className = "",
}) => {
  const { t } = useTranslation("labelDataValidationPage");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleInputChange = (input: string) => {
    setInputValue(input);
    setSuggestions(searchSuggestions(input, json.analyzeResult.paragraphs)); //testing purposes
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]);
  };

  const handleMouseEnter = (value: string) => {
    console.log(`Hovered text: ${value}`);
    handleHoveredTextChange(value);
  };

  const handleMouseLeave = () => {
    console.log("Mouse left text");
    handleHoveredTextChange(null);
  };

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
            <div style={{ width: '100%', position: 'relative' }}>
              <StyledTextField
                {...field}
                placeholder={placeholder}
                className="!ml-2 !text-[15px]"
                value={inputValue}
                autoComplete="off"
                onFocus={() => {
                  setIsFocused(true);
                  setIsInputFocused(true);
                }}
                onBlur={() => {
                  // setIsFocused(false);
                  // setIsInputFocused(false);
                  setTimeout(() => {
                    setIsFocused(false);
                    setIsInputFocused(false);
                    setSuggestions([]);
                  }, 100); // Delay to allow selecting suggestions
                }}
                onChange={(e) => {
                  field.onChange(e.target.value.trim());
                  handleInputChange(e.target.value);
                }}
                onMouseEnter={() => handleMouseEnter(inputValue)}
                onMouseLeave={handleMouseLeave}
                inputProps={{ maxLength: 256 }} // Optionally limit input length
                data-testid={`input-field-${valuePath}`}
              />
              {isInputFocused && suggestions.length > 0 && (
                <Box
                  className="autocomplete-suggestions"
                  display="block"
                  position="absolute"
                  width="100%"
                  border="1px solid black"
                  zIndex="1"
                  mt="4px"
                  bgcolor="white"
                >
                  {suggestions.map((suggestion, index) => (
                    <Typography
                      key={index}
                      className="suggestion-item"
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevent the input from losing focus
                        handleSuggestionClick(suggestion);
                      }}
                      onMouseEnter={(event) => event.currentTarget.style.backgroundColor = colors.grey[400]}
                      onMouseLeave={(event) => event.currentTarget.style.backgroundColor = 'white'}
                      style={{ cursor: "pointer", padding: "8px" }}
                    >
                      {suggestion}
                    </Typography>
                  ))}
                </Box>
              )}
            </div>
          )}
        />
      )}
    />
  );
};
