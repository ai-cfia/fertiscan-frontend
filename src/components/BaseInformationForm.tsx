import { FormComponentProps, LabelData, UNITS } from "@/types/types";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { VerifiedInput } from "./VerifiedFieldComponents";
import VerifiedQuantityMultiInput from "./VerifiedQuantityMultiInput";
import useHoverStore from "@/stores/hoverStore";

const BaseInformationForm: React.FC<FormComponentProps> = ({
  labelData,
  setLabelData,
}) => {
  const { t } = useTranslation("labelDataValidationPage");
  const methods = useForm<LabelData>({
    defaultValues: labelData,
  });

  const { setHoveredText } = useHoverStore();

  const watchedBaseInformation = useWatch({
    control: methods.control,
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
      <Box className="p-4" data-testid="base-information-form">
        <Box className="grid grid-cols-1 items-start sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xxl:grid-cols-2 gap-4 py-4">
          <VerifiedInput
            label={t("baseInformation.fields.name.label")}
            placeholder={t("baseInformation.fields.name.placeholder")}
            path="baseInformation.name"
            handleHoveredTextChange={setHoveredText} // Passe cette prop
          />
          <VerifiedInput
            label={t("baseInformation.fields.registrationNumber.label")}
            placeholder={t(
              "baseInformation.fields.registrationNumber.placeholder",
            )}
            path="baseInformation.registrationNumber"
            handleHoveredTextChange={setHoveredText} // Passe cette prop
          />
          <VerifiedInput
            label={t("baseInformation.fields.lotNumber.label")}
            placeholder={t("baseInformation.fields.lotNumber.placeholder")}
            path="baseInformation.lotNumber"
            handleHoveredTextChange={setHoveredText} // Passe cette prop
          />
          <VerifiedInput
            label={t("baseInformation.fields.npk.label")}
            placeholder={t("baseInformation.fields.npk.placeholder")}
            path="baseInformation.npk"
            handleHoveredTextChange={setHoveredText} // Passe cette prop
          />
          <VerifiedQuantityMultiInput
            label={t("baseInformation.fields.weight.label")}
            path="baseInformation.weight"
            unitOptions={UNITS.weight}
          />
          <VerifiedQuantityMultiInput
            label={t("baseInformation.fields.density.label")}
            path="baseInformation.density"
            unitOptions={UNITS.density}
          />
          <VerifiedQuantityMultiInput
            label={t("baseInformation.fields.volume.label")}
            path="baseInformation.volume"
            unitOptions={UNITS.volume}
          />
        </Box>
      </Box>
    </FormProvider>
  );
};

export default BaseInformationForm;
