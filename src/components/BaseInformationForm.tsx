import { FormComponentProps, LabelData, UNITS } from "@/types/types";
import useDebouncedSave from "@/utils/client/useDebouncedSave";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { VerifiedInput } from "./VerifiedFieldComponents";
import VerifiedQuantityMultiInput from "./VerifiedQuantityMultiInput";

const BaseInformationForm: React.FC<FormComponentProps> = ({
  loading = false,
  labelData,
  setLabelData,
}) => {
  const { t } = useTranslation("labelDataValidator");
  const sectionName = "baseInformation";
  const methods = useForm<LabelData>({
    defaultValues: labelData,
  });

  const watchedBaseInformation = useWatch({
    control: methods.control,
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
    save(sectionName, watchedBaseInformation);
  }, [watchedBaseInformation, save]);

  return (
    <FormProvider {...methods}>
      <Box className="p-4" data-testid="base-information-form">
        <Box className="grid grid-cols-1 items-start sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xxl:grid-cols-2 gap-4 py-4">
          <VerifiedInput
            label={t("baseInformation.fields.name.label")}
            placeholder={t("baseInformation.fields.name.placeholder")}
            path="baseInformation.name"
            loading={loading}
          />
          <VerifiedInput
            label={t("baseInformation.fields.registrationNumber.label")}
            placeholder={t(
              "baseInformation.fields.registrationNumber.placeholder",
            )}
            path="baseInformation.registrationNumber"
            loading={loading}
          />
          <VerifiedInput
            label={t("baseInformation.fields.lotNumber.label")}
            placeholder={t("baseInformation.fields.lotNumber.placeholder")}
            path="baseInformation.lotNumber"
            loading={loading}
          />
          <VerifiedInput
            label={t("baseInformation.fields.npk.label")}
            placeholder={t("baseInformation.fields.npk.placeholder")}
            path="baseInformation.npk"
            loading={loading}
          />
          <VerifiedQuantityMultiInput
            label={t("baseInformation.fields.weight.label")}
            path="baseInformation.weight"
            unitOptions={UNITS.weight}
            loading={loading}
          />
          <VerifiedQuantityMultiInput
            label={t("baseInformation.fields.density.label")}
            path="baseInformation.density"
            unitOptions={UNITS.density}
            loading={loading}
          />
          <VerifiedQuantityMultiInput
            label={t("baseInformation.fields.volume.label")}
            path="baseInformation.volume"
            unitOptions={UNITS.volume}
            loading={loading}
          />
        </Box>
      </Box>
    </FormProvider>
  );
};

export default BaseInformationForm;
