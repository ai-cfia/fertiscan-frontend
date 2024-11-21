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
      data-testid={`dual-input-with-status`}
    >
      {/* Label Section */}
      <Typography
        className="select-none px-2 !font-bold"
        data-testid={`input-label`}
      >
        {label}
      </Typography>

      {/* Fields Section */}
      <Box className="flex flex-1 flex-col">
        {fields.map((field, index) => (
          <Box key={field.id}>
            <Box className="flex items-center">
              {/* Dropdown for Units */}
              <Controller
                name={`${name}.${index}.unit`}
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="p-1 text-[15px] border rounded"
                    disabled={statusValue === FieldStatus.Verified}
                    data-testid={`unit-selector-${name}-${index}`}
                  >
                    {unitOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              />

              {/* Input Field */}
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
                      data-testid={`input-field-${name}-${index}`}
                      error={!!error}
                    />
                    {error && (
                      <Typography color="error" variant="caption">
                        {error.message}
                      </Typography>
                    )}
                  </>
                )}
              />

              {/* Remove Button with Tooltip */}
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
                  >
                    <DeleteIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
            <Divider
              className={`!mb-1 ${isFocused ? "!border-fertiscan-blue" : ""}`}
              data-testid={`divider`}
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
        >
          {t("addRow")}
        </Button>
      </Box>

      {/* Divider */}
      <Divider
        className={`my-2 ${isFocused ? "!border-fertiscan-blue" : ""}`}
        data-testid={`divider`}
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
      inputs: [{ value: "", unit: "kg" }],
      status: FieldStatus.Unverified,
    },
    mode: "onChange",
  });

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="p-4 space-y-4">
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

export default DummyComponent;
