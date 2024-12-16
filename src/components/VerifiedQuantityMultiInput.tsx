import { DEFAULT_QUANTITY } from "@/types/types";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import QuantityInput from "./QuantityInput";

interface VerifiedQuantityMultiInputProps {
  label: string;
  path: string;
  unitOptions: string[];
  className?: string;
}

const VerifiedQuantityMultiInput: React.FC<VerifiedQuantityMultiInputProps> = ({
  label,
  path,
  unitOptions,
  className = "",
}) => {
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

  const validateDuplicateUnit = (value: string) => {
    const isDuplicate =
      quantities.filter((item: { unit: string }) => item.unit === value)
        .length > 1;
    return !isDuplicate || "errors.duplicateUnit";
  };

  return (
    <Box>
      {/* Label Section */}
      <Typography
        className="select-none px-2 !font-bold text-left"
        data-testid={`quantity-multi-input-label-${path}`}
      >
        {label}
      </Typography>

      <Box
        className={`w-full flex items-center p-1 border-2 rounded-tr-md rounded-br-md ${
          isFocused ? "border-fertiscan-blue" : ""
        } ${verified ? "border-green-500 bg-gray-300" : ""}  ${className}`}
        data-testid={`quantity-multi-input-${path}`}
      >
        {/* Fields */}
        <Box
          className="flex flex-1 flex-col"
          data-testid={`fields-container-${path}`}
        >
          {fields.map((fieldItem, index) => {
            const isLastItem = index === fields.length - 1;

            return (
              <Box
                className="ml-2"
                key={fieldItem.id}
                data-testid={`field-row-${quantitiesPath}-${index}`}
              >
                <Box className="flex items-center">
                  {/* Value & Unit Input */}
                  <QuantityInput
                    name={`${quantitiesPath}.${index}`}
                    control={control}
                    unitOptions={unitOptions}
                    disabled={verified}
                    unitRules={{
                      validate: validateDuplicateUnit,
                    }}
                    onFocus={() => setIsFocused(true)}
                    onblur={() => setIsFocused(false)}
                    verified={verified}
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
                        className="text-white"
                        sx={{display: verified ? "none" : (fields.length === 1 ? "none" : "flex")}}
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
                  className={`!my-1 ${isFocused ? "!border-fertiscan-blue" : ""}`}
                  sx={{
                    bgcolor: verified ? "#00C55E" : "inherit",
                    display: isLastItem && verified? "none" : "block",
                  }}
                  data-testid={`row-divider-${quantitiesPath}-${index}`}
                />
              </Box>
            );
          })}

          {/* Add Row Button */}
          <Button
            size="small"
            className="!p-2 text-white bg-green-500"
            sx={{display: verified ? "none" : "flex"}}
            onClick={() => append(DEFAULT_QUANTITY)}
            startIcon={<AddIcon />}
            disabled={verified}
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
          sx={{ bgcolor: verified ? "#00C55E" : "inherit" }}
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
    </Box>
  );
};

export default VerifiedQuantityMultiInput;
