import { FormComponentProps, LabelData, UNITS } from "@/types/types";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import VerifiedInput from "./VerifiedInput";
import VerifiedQuantityMultiInput from "./VerifiedQuantityMultiInput";

function BaseInformationForm({ labelData, setLabelData }: FormComponentProps) {
  const methods = useForm<LabelData>({
    defaultValues: labelData,
  });

  const { t } = useTranslation("baseInformationForm");
  const { control } = methods;

  const watchedBaseInformation = useWatch({
    control,
    name: "baseInformation",
  });

  useEffect(() => {
    if (watchedBaseInformation) {
      setLabelData((prevLabelData) => ({
        ...prevLabelData,
        baseInformation: watchedBaseInformation,
      }));
    }
  }, [watchedBaseInformation, setLabelData]);

  return (
    <FormProvider {...methods}>
      <div className="p-4" data-testid="base-information-form">
        <Box className="grid grid-cols-1 items-start sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xxl:grid-cols-2 gap-4 py-4">
          <VerifiedInput
            label={t("fields.name.label")}
            placeholder={t("fields.name.placeholder")}
            path="baseInformation.name"
          />
          <VerifiedInput
            label={t("fields.registrationNumber.label")}
            placeholder={t("fields.registrationNumber.placeholder")}
            path="baseInformation.registrationNumber"
          />
          <VerifiedInput
            label={t("fields.lotNumber.label")}
            placeholder={t("fields.lotNumber.placeholder")}
            path="baseInformation.lotNumber"
          />
          <VerifiedInput
            label={t("fields.npk.label")}
            placeholder={t("fields.npk.placeholder")}
            path="baseInformation.npk"
          />
          <VerifiedQuantityMultiInput
            label={t("fields.weight.label")}
            path="baseInformation.weight"
            unitOptions={UNITS.weight}
          />
          <VerifiedQuantityMultiInput
            label={t("fields.density.label")}
            path="baseInformation.density"
            unitOptions={UNITS.density}
          />
          <VerifiedQuantityMultiInput
            label={t("fields.volume.label")}
            path="baseInformation.volume"
            unitOptions={UNITS.volume}
          />
        </Box>
      </div>
    </FormProvider>
  );
}

export default BaseInformationForm;
