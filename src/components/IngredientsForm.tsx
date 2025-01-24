import { FormComponentProps, LabelData, UNITS } from "@/types/types";
import useDebouncedSave from "@/utils/client/useDebouncedSave";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import VerifiedBilingualTable from "./VerifiedBilingualTable";

function IngredientsForm({
  labelData,
  setLabelData,
  loading = false,
}: FormComponentProps) {
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
      <Box className="p-4" data-testid="ingredients-form">
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
