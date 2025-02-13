import { Box } from "@mui/material";
import { Control, Controller, RegisterOptions } from "react-hook-form";
import { useTranslation } from "react-i18next";
import StyledAutocomplete from "./StyledAutocomplete";
import StyledTextField from "./StyledTextField";

interface QuantityInputProps {
  name: string;
  control: Control;
  unitOptions: string[];
  disabled?: boolean;
  unitRules?: RegisterOptions;
  onFocus?: () => void;
  onBlur?: () => void;
  verified?: boolean;
}

const QuantityInput = ({
  name,
  control,
  unitOptions,
  disabled = false,
  unitRules,
  onFocus,
  onBlur,
  verified,
}: QuantityInputProps) => {
  const { t } = useTranslation("labelDataValidator");

  return (
    <Box className="flex w-full" data-testid={`${name}-container`}>
      {/* Value Input Field */}
      <Controller
        name={`${name}.value`}
        control={control}
        rules={{
          pattern: {
            value: /^[0-9]*\.?[0-9]*$/,
            message: "errors.numbersOnly",
          },
          min: {
            value: 0,
            message: "errors.minValue",
          },
        }}
        render={({ field, fieldState: { error } }) => (
          <StyledTextField
            {...field}
            placeholder={t("quantityInput.placeholder.value")}
            disabled={disabled}
            onFocus={onFocus}
            onBlur={(e) => {
              onBlur?.();
              field.onChange(e.target.value.trim());
            }}
            aria-label={t("quantityInput.accessibility.valueInput")}
            data-testid={`${name}-value-input`}
            error={!!error}
            helperText={error?.message ? t(error.message) : ""}
          />
        )}
      />

      {/* Unit Selection Field */}
      <Controller
        name={`${name}.unit`}
        control={control}
        rules={unitRules}
        render={({ field, fieldState: { error } }) => (
          <StyledAutocomplete
            {...field}
            options={unitOptions}
            onChange={(event, newValue) => {
              field.onChange(newValue);
            }}
            onInputChange={(event, newInputValue) => {
              field.onChange(newInputValue);
            }}
            value={field.value || ""}
            disabled={disabled}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                className={`!w-[10ch] !px-2 bg-gray-100 ${verified ? "bg-gray-300": ""}`}
                aria-label={t("quantityInput.accessibility.unitDropdown")}
                data-testid={`${name}-unit-input`}
                placeholder={t("quantityInput.placeholder.unit")}
                onFocus={onFocus}
                onBlur={(e) => {
                  onBlur?.();
                  field.onChange(e.target.value.trim());
                }}
                error={!!error}
                helperText={error?.message ? t(error.message) : ""}
                slotProps={{
                  input: {
                    ...params.InputProps,
                  },
                }}
              />
            )}
          />
        )}
      />
    </Box>
  );
};

export default QuantityInput;
