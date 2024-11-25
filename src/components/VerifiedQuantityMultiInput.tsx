import { Quantity } from "@/types/types";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

function VerifiedQuantityMultiInput({
  label,
  placeholder,
  path,
  unitOptions,
  className = "",
}: {
  label: string;
  placeholder?: string;
  path: string;
  unitOptions: string[];
  className?: string;
}) {
  const { t } = useTranslation("labelDataValidationPage");
  const { control, trigger } = useFormContext();
  const [isFocused, setIsFocused] = useState(false);

  const quantitiesPath = `${path}.quantities`;
  const verifiedPath = `${path}.verified`;

  const { fields, append, remove } = useFieldArray({
    control,
    name: quantitiesPath,
  });

  const quantities = useWatch({
    control,
    name: quantitiesPath,
  });

  const verified: boolean = useWatch({
    control,
    name: verifiedPath,
  });

  const toggleVerified = async (
    verified: boolean,
    setVerified: (value: boolean) => void,
  ) => {
    const validationResults = await Promise.all(
      fields.map((_, index) =>
        Promise.all([
          trigger(`${quantitiesPath}.${index}.unit`),
          trigger(`${quantitiesPath}.${index}.value`),
        ]),
      ),
    );

    const allValid = validationResults.every((result) =>
      result.every((isValid) => isValid),
    );

    if (allValid) {
      setVerified(!verified);
    }
  };

  const handleAddRow = () => {
    const unusedOption = unitOptions.find(
      (option) =>
        !quantities.some((valueItem: Quantity) => valueItem.unit === option),
    );

    if (unusedOption) {
      append({ value: "", unit: unusedOption });
    } else {
      console.error("All options are already used");
    }
  };

  const validateDuplicateUnit = (value: string) => {
    const isDuplicate =
      quantities.filter((item: { unit: string }) => item.unit === value)
        .length > 1;
    return !isDuplicate || t("verifiedQuantityMultiInput.errors.duplicateUnit");
  };

  return (
    <Box
      className={`w-full flex items-center p-1 border-2 rounded-tr-md rounded-br-md ${
        isFocused ? "border-fertiscan-blue" : ""
      } ${className}`}
      data-testid={`quantity-multi-input-${path}`}
    >
      {/* Label Section */}
      <Typography
        className="select-none px-2 !font-bold"
        data-testid={`quantity-multi-input-label-${path}`}
      >
        {label}
      </Typography>

      {/* Fields */}
      <Box
        className="flex flex-1 flex-col"
        data-testid={`fields-container-${path}`}
      >
        {fields.map((fieldItem, index) => (
          <Box
            className="ml-2"
            key={fieldItem.id}
            data-testid={`field-row-${quantitiesPath}-${index}`}
          >
            <Box className="flex items-center">
              {/* Unit Selection Field */}
              <Controller
                name={`${quantitiesPath}.${index}.unit`}
                control={control}
                rules={{ validate: validateDuplicateUnit }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <select
                      {...field}
                      className="p-1 text-[15px] border rounded"
                      disabled={verified}
                      aria-label={t(
                        "verifiedQuantityMultiInput.accessibility.unitDropdown",
                      )}
                      data-testid={`${quantitiesPath}.${index}.unit`}
                    >
                      {unitOptions.map((option) => (
                        <option key={option} value={option}>
                          {t(`verifiedQuantityMultiInput.units.${option}`)}
                        </option>
                      ))}
                    </select>
                    {error && (
                      <Tooltip title={error.message || ""}>
                        <ErrorOutlineIcon
                          className="ml-1"
                          color="error"
                          fontSize="small"
                          aria-label={t(
                            "verifiedQuantityMultiInput.accessibility.errorIcon",
                          )}
                          data-testid={`unit-error-icon-${quantitiesPath}-${index}`}
                        />
                      </Tooltip>
                    )}
                  </>
                )}
              />

              {/* Value Input Field */}
              <Controller
                name={`${quantitiesPath}.${index}.value`}
                control={control}
                rules={{
                  pattern: {
                    value: /^[0-9]*\.?[0-9]*$/,
                    message: t("verifiedQuantityMultiInput.errors.numbersOnly"),
                  },
                  min: {
                    value: 0,
                    message: t("verifiedQuantityMultiInput.errors.minValue"),
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <InputBase
                      {...field}
                      className="flex-1 p-2 !text-[15px]"
                      placeholder={
                        placeholder ||
                        t("verifiedQuantityMultiInput.defaultPlaceholder")
                      }
                      disabled={verified}
                      onFocus={() => setIsFocused(true)}
                      onBlur={(e) => {
                        setIsFocused(false);
                        field.onChange(e.target.value.trim());
                      }}
                      aria-label={t(
                        "verifiedQuantityMultiInput.accessibility.valueInput",
                      )}
                      data-testid={`${quantitiesPath}.${index}.value`}
                      error={!!error}
                    />
                    {error && (
                      <Tooltip title={error.message || ""}>
                        <ErrorOutlineIcon
                          className="ml-1"
                          color="error"
                          fontSize="small"
                          data-testid={`value-error-icon-${quantitiesPath}-${index}`}
                        />
                      </Tooltip>
                    )}
                  </>
                )}
              />

              {/* Delete Row Button */}
              <Tooltip
                enterDelay={1000}
                title={t("verifiedQuantityMultiInput.deleteRow")}
                disableHoverListener={verified}
              >
                <span>
                  <IconButton
                    size="small"
                    className="text-white bg-red-500"
                    onClick={() => remove(index)}
                    disabled={verified}
                    aria-label={t(
                      "verifiedQuantityMultiInput.accessibility.deleteRowButton",
                    )}
                    data-testid={`delete-button-${quantitiesPath}-${index}`}
                  >
                    <DeleteIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
            <Divider
              className={`!mb-1 ${isFocused ? "!border-fertiscan-blue" : ""}`}
              data-testid={`row-divider-${quantitiesPath}-${index}`}
            />
          </Box>
        ))}

        {/* Add Row Button */}
        <Button
          size="small"
          className="!p-2 text-white bg-green-500"
          onClick={handleAddRow}
          startIcon={<AddIcon />}
          disabled={verified || fields.length >= unitOptions.length}
          aria-label={t(
            "verifiedQuantityMultiInput.accessibility.addRowButton",
          )}
          data-testid={`add-button-${path}`}
        >
          {t("verifiedQuantityMultiInput.addRow")}
        </Button>
      </Box>

      {/* Vertical Divider */}
      <Divider
        className={`my-2 ${isFocused ? "!border-fertiscan-blue" : ""}`}
        data-testid={`vertical-divider-${quantitiesPath}`}
        flexItem
        orientation="vertical"
      />

      {/* Verified Toggle Button */}
      <Controller
        name={verifiedPath}
        control={control}
        render={({ field: { value, onChange } }) => (
          <Tooltip
            title={
              verified
                ? t("verifiedQuantityMultiInput.unverify")
                : t("verifiedQuantityMultiInput.verify")
            }
            enterDelay={1000}
          >
            <IconButton
              onClick={() => toggleVerified(value, onChange)}
              aria-label={t(
                "verifiedQuantityMultiInput.accessibility.verifyToggleButton",
              )}
              data-testid={`toggle-verified-btn-${path}`}
            >
              <CheckIcon
                className={value ? "text-green-500" : ""}
                data-testid={`verified-icon-${path}`}
              />
            </IconButton>
          </Tooltip>
        )}
      />
    </Box>
  );
}

export default VerifiedQuantityMultiInput;