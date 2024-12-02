import {
  DEFAULT_ORGANIZATION,
  FormComponentProps,
  LabelData,
  Organization,
} from "@/types/types";
import { checkFieldRecord } from "@/utils/common";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import RemoveDoneIcon from "@mui/icons-material/RemoveDone";
import { Box, Button, Tooltip } from "@mui/material";
import { useCallback, useEffect } from "react";
import {
  FieldPath,
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { VerifiedInput } from "./VerifiedFieldComponents";

const fieldNames = Object.keys(DEFAULT_ORGANIZATION) as Array<
  keyof Organization
>;

const OrganizationsForm: React.FC<FormComponentProps> = ({
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
    }
  }, [watchedOrganizations, setLabelData]);

  const setAllVerified = useCallback(
    (orgIndex: number, verified: boolean) => {
      fieldNames.forEach((fieldName) => {
        const fieldPath =
          `organizations.${orgIndex}.${fieldName}.verified` as FieldPath<LabelData>;
        setValue(fieldPath, verified, {
          shouldValidate: true,
          shouldDirty: true,
        });
      });
    },
    [setValue],
  );

  return (
    <FormProvider {...methods}>
      <Box className="p-4" data-testid="organizations-form">
        <Box>
          {fields.map((field, index) => (
            <Box
              key={field.id}
              className="mb-4"
              data-testid={`organization-${index}`}
            >
              <OrganizationInformation index={index} />
              <Box className="flex flex-wrap mt-4 justify-end gap-2">
                <Tooltip
                  title="Mark all as Verified"
                  enterDelay={1000}
                  disableHoverListener={checkFieldRecord(
                    watchedOrganizations?.[index],
                    true,
                  )}
                >
                  <span>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => setAllVerified(index, true)}
                      disabled={checkFieldRecord(
                        watchedOrganizations?.[index],
                        true,
                      )}
                      data-testid={`verify-all-btn-${index}`}
                    >
                      <DoneAllIcon />
                    </Button>
                  </span>
                </Tooltip>
                <Tooltip
                  title="Mark all as Unverified"
                  enterDelay={1000}
                  disableHoverListener={checkFieldRecord(
                    watchedOrganizations?.[index],
                    false,
                  )}
                >
                  <span>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => setAllVerified(index, false)}
                      disabled={checkFieldRecord(
                        watchedOrganizations?.[index],
                        false,
                      )}
                      data-testid={`unverify-all-btn-${index}`}
                    >
                      <RemoveDoneIcon />
                    </Button>
                  </span>
                </Tooltip>
                <Tooltip title="Remove Organization" enterDelay={1000}>
                  <span>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => remove(index)}
                      data-testid={`remove-org-btn-${index}`}
                    >
                      <DeleteIcon />
                    </Button>
                  </span>
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
              data-testid="add-org-btn"
            >
              Add Organization
            </Button>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  );
};

function OrganizationInformation({ index }: { index: number }) {
  return (
    <Box
      className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xxl:grid-cols-2 gap-4"
      data-testid={`organization-info-${index}`}
    >
      <VerifiedInput
        label="Name"
        placeholder="Enter organization name"
        path={`organizations.${index}.name`}
        data-testid={`org-name-input-${index}`}
      />
      <VerifiedInput
        label="Address"
        placeholder="Enter address"
        path={`organizations.${index}.address`}
        data-testid={`org-address-input-${index}`}
      />
      <VerifiedInput
        label="Website"
        placeholder="Enter website"
        path={`organizations.${index}.website`}
        data-testid={`org-website-input-${index}`}
      />
      <VerifiedInput
        label="Phone Number"
        placeholder="Enter phone number"
        path={`organizations.${index}.phoneNumber`}
        data-testid={`org-phone-input-${index}`}
      />
    </Box>
  );
}

export default OrganizationsForm;
