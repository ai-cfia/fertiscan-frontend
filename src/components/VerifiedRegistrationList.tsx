import { DEFAULT_REGISTRATION_NUMBER } from "@/types/types";
import { useFieldArray, useFormContext } from "react-hook-form";
import RegistrationInput from "./RegistrationInput";
import StyledListContainer from "./StyledListContainer";
import { VerifiedFieldWrapper } from "./VerifiedFieldComponents";
import VerifiedListRow from "./VerifiedListRow";

interface VerifiedRegistrationListProps {
  label: string;
  path: string;
  className?: string;
  loading?: boolean;
}

const VerifiedRegistrationList: React.FC<VerifiedRegistrationListProps> = ({
  label,
  path,
  className = "",
  loading = false,
}) => {
  const valuesPath = `${path}.values`;
  const { control, trigger } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: valuesPath,
  });

  const validateFields = async (callback: (valid: boolean) => void) => {
    const validationResults = await Promise.all(
      fields.map((_, index) =>
        Promise.all([
          trigger(`${valuesPath}.${index}.identifier`),
          trigger(`${valuesPath}.${index}.type`),
        ]),
      ),
    );
    const allValid = validationResults.every((result) =>
      result.every((isValid) => isValid),
    );
    callback(allValid);
  };

  return (
    <VerifiedFieldWrapper
      label={label}
      path={path}
      className={className}
      loading={loading}
      validate={validateFields}
      renderField={({ setIsFocused, control, verified }) => (
        <StyledListContainer
          path={path}
          verified={verified}
          onAppend={() => append(DEFAULT_REGISTRATION_NUMBER)}
        >
          {fields.map((fieldItem, index) => (
            <VerifiedListRow
              key={fieldItem.id}
              verified={verified}
              hideDelete={fields.length === 1}
              onDelete={() => remove(index)}
              isLastItem={index === fields.length - 1}
            >
              <RegistrationInput
                name={`${valuesPath}.${index}`}
                control={control}
                disabled={verified}
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

export default VerifiedRegistrationList;
