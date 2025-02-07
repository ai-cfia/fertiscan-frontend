import { FormComponentProps, LabelData, UNITS } from "@/types/types";
import useDebouncedSave from "@/utils/client/useDebouncedSave";
import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import VerifiedBilingualTable from "./VerifiedBilingualTable";
import { VerifiedRadio } from "./VerifiedFieldComponents";

function IngredientsForm({
  labelData,
  setLabelData,
  loading = false,
}: FormComponentProps) {
  const { t } = useTranslation("labelDataValidator");
  const methods = useForm<LabelData>({
    defaultValues: labelData,
  });
  const sectionName = "ingredients";

  const { control } = methods;

  const watchedIngredients = useWatch({
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
    save(sectionName, watchedIngredients);
  }, [watchedIngredients, save]);

  return (
    <FormProvider {...methods}>
      <Box className="p-4 text-left" data-testid="ingredients-form">
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          data-testid="guaranteed-analysis-title"
        >
          {t("guaranteedAnalysis.labellingOptions")}
        </Typography>
        <Box className="flex flex-shrink-0 mb-4">
          <VerifiedRadio
            label={t("guaranteedAnalysis.recordKeeping")}
            path="ingredients.recordKeeping"
            loading={loading}
            isHelpActive={true}
            helpText={t("guaranteedAnalysis.helpMessage.recordKeeping")}
            data-testid="guaranteed-analysis-record-keeping"
          />
        </Box>
        <VerifiedBilingualTable
          path={sectionName}
          unitOptions={UNITS.ingredients}
          valueColumn
          loading={loading}
        />
      </Box>
    </FormProvider>
  );
}

export default IngredientsForm;
