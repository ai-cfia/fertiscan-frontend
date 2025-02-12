import {
  DEFAULT_ORGANIZATION,
  FormComponentProps,
  LabelData,
  Organization,
} from "@/types/types";
import { checkFieldRecord } from "@/utils/client/fieldValidation";
import useDebouncedSave from "@/utils/client/useDebouncedSave";
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
import { useTranslation } from "react-i18next";

const fieldNames = Object.keys(DEFAULT_ORGANIZATION) as Array<
  keyof Organization
>;

const OrganizationsForm: React.FC<FormComponentProps> = ({
  labelData,
  setLabelData,
  loading = false,
}) => {
  const methods = useForm<LabelData>({
    defaultValues: labelData,
  });
  const { t } = useTranslation("labelDataValidator");

  const { control, setValue } = methods;
  const sectionName = "organizations";

  const { fields, append, remove } = useFieldArray({
    control,
    name: sectionName,
  });

  const watchedOrganizations = useWatch({
    control,
    name: sectionName,
  });

  const save = useDebouncedSave(setLabelData);

  useEffect(() => {
    const currentValues = methods.getValues();
    if (JSON.stringify(currentValues) !== JSON.stringify(labelData)) {
      methods.reset(labelData);
    }
  }, [labelData, methods]);

  useEffect(() => {
    save(sectionName, watchedOrganizations);
  }, [watchedOrganizations, save]);

  const setAllVerified = useCallback(
    (orgIndex: number, verified: boolean) => {
      fieldNames.forEach((fieldName) => {
        const fieldPath =
          `${sectionName}.${orgIndex}.${fieldName}.verified` as FieldPath<LabelData>;
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
              <OrganizationInformation index={index} loading={loading} />
              <Box className="flex flex-wrap mt-4 justify-end gap-2">
                <Tooltip title={t("organizations.markAllVerified")} enterDelay={1000}>
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
                </Tooltip>
                <Tooltip title={t("organizations.markAllUnverified")} enterDelay={1000}>
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
                </Tooltip>
                <Tooltip title={t("organizations.removeOrganisation")} enterDelay={1000}>
                  <span>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => remove(index)}
                      data-testid={`remove-org-btn-${index}`}
                      aria-label={t("organizations.removeOrganisation")}
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
              variant="outlined"
              color="secondary"
              onClick={() => append(DEFAULT_ORGANIZATION)}
              startIcon={<AddIcon />}
              data-testid="add-org-btn"
            >
              {t("organizations.addOrganization")}
            </Button>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  );
};

interface OrganizationInformationProps {
  index: number;
  loading?: boolean;
}

const OrganizationInformation: React.FC<OrganizationInformationProps> = ({
  index,
  loading = false,
}) => {
  const { t } = useTranslation("labelDataValidator");
  return (
    <Box
      className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xxl:grid-cols-2 gap-4"
      data-testid={`organization-info-${index}`}
    >
      <VerifiedInput
        label={t("organizations.fields.name.label")}
        placeholder={t("organizations.fields.name.placeholder")}
        path={`organizations.${index}.name`}
        loading={loading}
        data-testid={`org-name-input-${index}`}
        isFocus={true}
      />
      <VerifiedInput
        label={t("organizations.fields.address.label")}
        placeholder={t("organizations.fields.address.placeholder")}
        path={`organizations.${index}.address`}
        loading={loading}
        data-testid={`org-address-input-${index}`}
      />
      <VerifiedInput
        label={t("organizations.fields.website.label")}
        placeholder={t("organizations.fields.website.placeholder")}
        path={`organizations.${index}.website`}
        loading={loading}
        data-testid={`org-website-input-${index}`}
      />
      <VerifiedInput
        label={t("organizations.fields.phone.label")}
        placeholder={t("organizations.fields.phone.placeholder")}
        path={`organizations.${index}.phoneNumber`}
        loading={loading}
        data-testid={`org-phone-input-${index}`}
      />
    </Box>
  );
};

export default OrganizationsForm;
