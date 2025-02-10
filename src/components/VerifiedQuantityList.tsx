import { DEFAULT_QUANTITY } from "@/types/types";
import { Typography } from "@mui/material";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import QuantityInput from "./QuantityInput";
import StyledListContainer from "./StyledListContainer";
import { VerifiedFieldWrapper } from "./VerifiedFieldComponents";
import VerifiedListRow from "./VerifiedListRow";

interface VerifiedQuantityListProps {
  label: string;
  path: string;
  unitOptions: string[];
  className?: string;
  loading?: boolean;
}

const VerifiedQuantityList: React.FC<VerifiedQuantityListProps> = ({
  label,
  path,
  unitOptions,
  className = "",
  loading = false,
}) => {
  const { control, trigger } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${path}.quantities`,
  });
  const quantitiesPath = `${path}.quantities`;
  const quantities = useWatch({
    control,
    name: quantitiesPath,
  });

  const validateFields = async (callback: (valid: boolean) => void) => {
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
    callback(allValid);
  };

  const validateDuplicateUnit = (value: string) => {
    const isDuplicate =
      quantities.filter((item: { unit: string }) => item.unit === value)
        .length > 1;
    return !isDuplicate || "errors.duplicateUnit";
  };

  return (
    <VerifiedFieldWrapper
      label={
        <Typography
          className="select-none px-2 !font-bold text-left"
          data-testid={`quantity-multi-input-label-${path}`}
        >
          {label}
        </Typography>
      }
      path={path}
      className={className}
      loading={loading}
      validate={validateFields}
      renderField={({ setIsFocused, control, verified }) => (
        <StyledListContainer
          path={path}
          verified={verified}
          onAppend={() => append(DEFAULT_QUANTITY)}
        >
          {fields.map((fieldItem, index) => (
            <VerifiedListRow
              key={fieldItem.id}
              verified={verified}
              hideDelete={fields.length === 1}
              onDelete={() => remove(index)}
              isLastItem={index === fields.length - 1}
            >
              <QuantityInput
                name={`${quantitiesPath}.${index}`}
                control={control}
                unitOptions={unitOptions}
                disabled={verified}
                unitRules={{ validate: validateDuplicateUnit }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                verified={verified}
              />
            </VerifiedListRow>
          ))}
        </StyledListContainer>
      )}
    />
  );
};

export default VerifiedQuantityList;
