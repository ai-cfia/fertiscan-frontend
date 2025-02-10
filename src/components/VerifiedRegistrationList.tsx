import { Typography } from "@mui/material";
import { useFieldArray, useFormContext } from "react-hook-form";
import RegistrationInput from "./RegistrationInput";
import StyledListContainer from "./StyledListContainer";
import { VerifiedFieldWrapper } from "./VerifiedFieldComponents";
import VerifiedListRow from "./VerifiedListRow";

interface VerifiedRegistrationListProps {
  label: string;
  path: string;
  registrationTypes: string[];
  className?: string;
  loading?: boolean;
}

const VerifiedRegistrationList: React.FC<VerifiedRegistrationListProps> = ({
  label,
  path,
  registrationTypes,
  className = "",
  loading = false,
}) => {
  const { control, trigger } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${path}.registrations`,
  });
  const registrationsPath = `${path}.registrations`;

  const validateFields = async (callback: (valid: boolean) => void) => {
    const validationResults = await Promise.all(
      fields.map((_, index) =>
        Promise.all([
          trigger(`${registrationsPath}.${index}.number`),
          trigger(`${registrationsPath}.${index}.type`),
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
      label={
        <Typography
          className="!font-bold select-none text-left px-2"
          data-testid={`registration-list-label-${path}`}
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
          onAppend={() => append({ number: "", type: "" })}
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
                name={`${registrationsPath}.${index}`}
                control={control}
                registrationTypes={registrationTypes}
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
