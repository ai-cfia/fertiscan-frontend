import { FieldStatus } from "@/types/types";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
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
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

function QuantityMultiInput({
  label,
  placeholder,
  name,
  statusName,
  unitOptions,
  className = "",
}: {
  label: string;
  placeholder?: string;
  name: string;
  statusName: string;
  unitOptions: string[];
  className?: string;
}) {
  const { t } = useTranslation("quantityMultiInput");
  const { control, trigger } = useFormContext();
  const [isFocused, setIsFocused] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const statusValue = useWatch({
    control,
    name: statusName,
  });

  const toggleVerified = async (
    currentStatus: FieldStatus,
    setStatus: (value: FieldStatus) => void,
  ) => {
    if (currentStatus !== FieldStatus.Error) {
      const isValid = await trigger(name);
      if (isValid) {
        setStatus(
          currentStatus === FieldStatus.Verified
            ? FieldStatus.Unverified
            : FieldStatus.Verified,
        );
      }
    }
  };

  return (
    <Box
      className={`w-full flex items-center p-1 border-2 rounded-tr-md rounded-br-md ${
        isFocused ? "border-fertiscan-blue" : ""
      } ${className}`}
      data-testid={`quantity-multi-input-${name}`}
    >
      {/* Label Section */}
      <Typography
        className="select-none px-2 !font-bold"
        data-testid={`quantity-multi-input-label-${name}`}
      >
        {label}
      </Typography>

      {/* Fields Section */}
      <Box
        className="flex flex-1 flex-col"
        data-testid={`fields-container-${name}`}
      >
        {fields.map((fieldItem, index) => (
          <Box
            key={fieldItem.id}
            data-testid={`field-row-${name}-${fieldItem.id}`}
          >
            <Box className="flex items-center">
              <Controller
                name={`${name}.${index}.unit`}
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="p-1 text-[15px] border rounded"
                    disabled={statusValue === FieldStatus.Verified}
                    data-testid={`unit-selector-${name}-${fieldItem.id}`}
                  >
                    {unitOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              />
              <Controller
                name={`${name}.${index}.value`}
                control={control}
                rules={{
                  pattern: {
                    value: /^[0-9]*\.?[0-9]*$/,
                    message: t("errors.numbersOnly"),
                  },
                  min: {
                    value: 0,
                    message: t("errors.minValue"),
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <InputBase
                      {...field}
                      className="flex-1 p-2 !text-[15px]"
                      placeholder={placeholder || t("defaultPlaceholder")}
                      disabled={statusValue === FieldStatus.Verified}
                      onFocus={() => setIsFocused(true)}
                      onBlur={(e) => {
                        setIsFocused(false);
                        field.onChange(e.target.value.trim());
                      }}
                      data-testid={`input-field-${name}-${fieldItem.id}`}
                      error={!!error}
                    />
                    {error && (
                      <Typography
                        color="error"
                        variant="caption"
                        data-testid={`error-message-${name}-${fieldItem.id}`}
                      >
                        {error.message}
                      </Typography>
                    )}
                  </>
                )}
              />
              <Tooltip
                enterDelay={1000}
                title={t("deleteRow")}
                disableHoverListener={statusValue === FieldStatus.Verified}
              >
                <span>
                  <IconButton
                    size="small"
                    className="text-white bg-red-500"
                    onClick={() => remove(index)}
                    disabled={statusValue === FieldStatus.Verified}
                    data-testid={`delete-button-${name}-${fieldItem.id}`}
                  >
                    <DeleteIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
            <Divider
              className={`!mb-1 ${isFocused ? "!border-fertiscan-blue" : ""}`}
              data-testid={`row-divider-${name}-${fieldItem.id}`}
            />
          </Box>
        ))}
        {/* Add Button */}
        <Button
          size="small"
          className="!p-2 text-white bg-green-500"
          onClick={() => append({ value: "", unit: unitOptions[0] })}
          startIcon={<AddIcon />}
          disabled={statusValue === FieldStatus.Verified}
          data-testid={`add-button-${name}`}
        >
          {t("addRow")}
        </Button>
      </Box>

      {/* Divider */}
      <Divider
        className={`my-2 ${isFocused ? "!border-fertiscan-blue" : ""}`}
        data-testid={`vertical-divider-${name}`}
        flexItem
        orientation="vertical"
      />

      {/* Status Toggle */}
      <Controller
        name={statusName}
        control={control}
        render={({ field: { value, onChange } }) => (
          <Tooltip
            title={
              statusValue === FieldStatus.Verified ? t("unverify") : t("verify")
            }
            enterDelay={1000}
          >
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

export function DummyComponent() {
  const methods = useForm({
    defaultValues: {
      inputs: [{ value: 0, unit: "kg" }],
      status: FieldStatus.Unverified,
    },
    mode: "onChange",
  });

  return (
    <FormProvider {...methods}>
      <form className="p-4 space-y-4">
        <QuantityMultiInput
          label="Dynamic"
          // placeholder="Enter value"
          name="inputs"
          statusName="status"
          unitOptions={["kg", "lb", "oz", "ton"]}
          className="mx-auto max-w-md"
        />
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded-md"
        >
          Submit
        </button>
      </form>
    </FormProvider>
  );
}

export default QuantityMultiInput;
