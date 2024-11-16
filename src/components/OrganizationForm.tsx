import { FieldStatus } from "@/types/field";
import {
  DEFAULT_ORGANIZATION,
  LabelData,
  Organization,
} from "@/types/organization";
import AddIcon from "@mui/icons-material/Add";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import RemoveIcon from "@mui/icons-material/Remove";
import RemoveDoneIcon from "@mui/icons-material/RemoveDone";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { useCallback, useEffect } from "react";
import {
  FieldPath,
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import InputWithStatus from "./InputWithStatus";
import { StepComponentProps, StepStatus } from "./stepper";

const fieldNames = Object.keys(DEFAULT_ORGANIZATION) as Array<
  keyof Organization
>;

const OrganizationForm: React.FC<StepComponentProps> = ({
  title,
  setStatus,
  labelData,
  setLabelData,
}) => {
  const methods = useForm<LabelData>({
    defaultValues: labelData,
  });

  const { control, setValue } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "organizations",
  });

  const watchedOrganizations = useWatch({
    control,
    name: "organizations",
  });

  useEffect(() => {
    if (watchedOrganizations) {
      setLabelData((prevLabelData) => ({
        ...prevLabelData,
        organizations: watchedOrganizations,
      }));

      const isAllChecked = watchedOrganizations.every(
        (org) =>
          org &&
          fieldNames.every(
            (fieldName) => org[fieldName]?.status === FieldStatus.Verified,
          ),
      );

      setStatus(isAllChecked ? StepStatus.Completed : StepStatus.Incomplete);
    }
  }, [watchedOrganizations, setLabelData, setStatus]);

  const setAllFieldsStatus = useCallback(
    (orgIndex: number, status: FieldStatus) => {
      fieldNames.forEach((fieldName) => {
        const fieldPath =
          `organizations.${orgIndex}.${fieldName}.status` as FieldPath<LabelData>;
        setValue(fieldPath, status, {
          shouldValidate: true,
          shouldDirty: true,
        });
      });
    },
    [setValue],
  );

  const areAllFieldStatus = (index: number, status: FieldStatus) => {
    const currentOrg = watchedOrganizations?.[index];
    return fieldNames.every(
      (fieldName) => currentOrg?.[fieldName].status === status,
    );
  };

  return (
    <FormProvider {...methods}>
      <div className="p-4">
        <Typography variant="h6" className="text-lg font-bold">
          {title}
        </Typography>
        <Box className="">
          {fields.map((field, index) => (
            <Box key={field.id} className="mb-4 py-4">
              <OrganizationInformation index={index} />
              <Box className="flex flex-wrap mt-4 justify-end gap-2">
                <Tooltip title="Mark all as Verified" enterDelay={1000}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() =>
                      setAllFieldsStatus(index, FieldStatus.Verified)
                    }
                    disabled={areAllFieldStatus(index, FieldStatus.Verified)}
                  >
                    <DoneAllIcon />
                  </Button>
                </Tooltip>
                <Tooltip title="Mark all as Unverified" enterDelay={1000}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() =>
                      setAllFieldsStatus(index, FieldStatus.Unverified)
                    }
                    disabled={areAllFieldStatus(index, FieldStatus.Unverified)}
                  >
                    <RemoveDoneIcon />
                  </Button>
                </Tooltip>
                <Tooltip title="Remove Organization" enterDelay={1000}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => remove(index)}
                  >
                    <RemoveIcon />
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          ))}
          <Box className="mt-6 text-center">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => append(DEFAULT_ORGANIZATION)}
              startIcon={<AddIcon />}
            >
              Add Organization
            </Button>
          </Box>
        </Box>
      </div>
    </FormProvider>
  );
};

function OrganizationInformation({ index }: { index: number }) {
  return (
    <Box className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xxl:grid-cols-2 gap-4">
      <InputWithStatus
        label="Name"
        placeholder="Enter organization name"
        name={`organizations.${index}.name.value`}
        statusName={`organizations.${index}.name.status`}
      />
      <InputWithStatus
        label="Address"
        placeholder="Enter address"
        name={`organizations.${index}.address.value`}
        statusName={`organizations.${index}.address.status`}
      />
      <InputWithStatus
        label="Website"
        placeholder="Enter website"
        name={`organizations.${index}.website.value`}
        statusName={`organizations.${index}.website.status`}
      />
      <InputWithStatus
        label="Phone Number"
        placeholder="Enter phone number"
        name={`organizations.${index}.phoneNumber.value`}
        statusName={`organizations.${index}.phoneNumber.status`}
      />
    </Box>
  );
}

export default OrganizationForm;
