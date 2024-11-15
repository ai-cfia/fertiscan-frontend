import { Box, Divider, Typography } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import OrganizationInformation, {
  Organization,
} from "./OrganizationInformation";
import { InputStatus } from "./StatusInput";
import { StepComponentProps, StepStatus } from "./stepper";

export interface OrganizationsProps extends StepComponentProps {
  organizations: Organization[];
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>;
}

const OrganizationForm: React.FC<OrganizationsProps> = ({
  title,
  setStatus,
  organizations,
  setOrganizations,
}) => {
  const methods = useForm({
    defaultValues: { organizations },
  });

  const watchedValues = useWatch({
    control: methods.control,
    name: "organizations",
  });

  useEffect(() => {
    console.log("watchedValues", watchedValues);
    if (watchedValues) {
      setOrganizations(watchedValues);

      const isAllChecked = watchedValues.every(
        (org: Organization) =>
          org &&
          [org.name, org.address, org.website, org.phoneNumber].every(
            (field) => field.status === InputStatus.Verified,
          ),
      );

      setStatus(isAllChecked ? StepStatus.Completed : StepStatus.Incomplete);
    }
  }, [watchedValues, setOrganizations, setStatus]);

  return (
    <FormProvider {...methods}>
      <div>
        <Typography variant="h6">{title}</Typography>
        <Box className="flex flex-col gap-4 p-6">
          {organizations.map((_, index) => (
            <div key={index}>
              <OrganizationInformation index={index} />
              {index < organizations.length - 1 && <Divider />}
            </div>
          ))}
        </Box>
      </div>
    </FormProvider>
  );
};

export default OrganizationForm;
