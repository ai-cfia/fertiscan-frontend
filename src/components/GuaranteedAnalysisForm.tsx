import { FormComponentProps, LabelData, UNITS } from "@/types/types";
import useDebouncedSave from "@/utils/client/useDebouncedSave";
import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import VerifiedBilingualTable from "./VerifiedBilingualTable";
import { VerifiedInput, VerifiedRadio } from "./VerifiedFieldComponents";

const GuaranteedAnalysisForm: React.FC<FormComponentProps> = ({
  loading = false,
  labelData,
  setLabelData,
}) => {
  const { t } = useTranslation("labelDataValidator");
  const methods = useForm<LabelData>({
    defaultValues: labelData,
  });
  const sectionName = "guaranteedAnalysis";

  const watchedGuaranteedAnalysis = useWatch({
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
    const handler = setTimeout(() => {
         save(sectionName, watchedGuaranteedAnalysis);
    }, 300);
    return () => clearTimeout(handler);
  }, [watchedGuaranteedAnalysis, save]);

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
            loading={loading}
          />
          <VerifiedInput
            label={t("guaranteedAnalysis.labelFr")}
            placeholder={t("guaranteedAnalysis.placeholderFr")}
            path="guaranteedAnalysis.titleFr"
            loading={loading}
          />
          <Box className="flex flex-shrink-0">
            <VerifiedRadio
              label={t("guaranteedAnalysis.isMinimal")}
              path="guaranteedAnalysis.isMinimal"
              loading={loading}
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
            loading={loading}
          />
        </Box>
      </Box>
    </FormProvider>
  );
};

export default GuaranteedAnalysisForm;
