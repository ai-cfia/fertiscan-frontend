import { FormComponentProps, LabelData, UNITS } from "@/types/types";
import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import VerifiedBilingualTable from "./VerifiedBilingualTable";
import { VerifiedCheckbox, VerifiedInput } from "./VerifiedFieldComponents";

function GuaranteedAnalysisForm({
  labelData,
  setLabelData,
}: FormComponentProps) {
  const { t } = useTranslation("labelDataValidationPage");
  const methods = useForm<LabelData>({
    defaultValues: labelData,
  });

  const { control } = methods;

  const watchedGuaranteedAnalysis = useWatch({
    control,
    name: "guaranteedAnalysis",
  });

  useEffect(() => {
    if (watchedGuaranteedAnalysis) {
      setLabelData((prevLabelData) => ({
        ...prevLabelData,
        guaranteedAnalysis: watchedGuaranteedAnalysis,
      }));
    }
  }, [watchedGuaranteedAnalysis, setLabelData]);

  return (
    <FormProvider {...methods}>
      <Box className="p-4 text-left" data-testid="guaranteed-analysis-form">
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          data-testid="guaranteed-analysis-title"
        >
          {t("guaranteedAnalysis.title")}
        </Typography>
        <Box className="grid grid-cols-1 items-start sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xxl:grid-cols-2 gap-4 p-4">
          <VerifiedInput
            label={t("guaranteedAnalysis.labelEn")}
            placeholder={t("guaranteedAnalysis.placeholderEn")}
            path="guaranteedAnalysis.titleEn"
          />
          <VerifiedInput
            label={t("guaranteedAnalysis.labelFr")}
            placeholder={t("guaranteedAnalysis.placeholderFr")}
            path="guaranteedAnalysis.titleFr"
          />
          <Box className="flex flex-shrink-0">
            <VerifiedCheckbox
              label={t("guaranteedAnalysis.isMinimal")}
              path="guaranteedAnalysis.isMinimal"
            />
          </Box>
        </Box>

        <Typography
          variant="subtitle1"
          fontWeight="bold"
          className="!mt-16"
          data-testid="guaranteed-analysis-nutrients-title"
        >
          {t("guaranteedAnalysis.nutrients")}
        </Typography>
        <Box className="px-4">
          <VerifiedBilingualTable
            path={"guaranteedAnalysis.nutrients"}
            valueColumn
            unitOptions={UNITS.guaranteedAnalysis}
          />
        </Box>
      </Box>
    </FormProvider>
  );
}

export default GuaranteedAnalysisForm;
