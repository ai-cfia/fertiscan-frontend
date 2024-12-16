import { FormComponentProps, LabelData, UNITS } from "@/types/types";
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

  const { control } = methods;

  const watchedIngredients = useWatch({
    control,
    name: "ingredients",
  });

  useEffect(() => {
    const currentValues = methods.getValues();
    if (JSON.stringify(currentValues) !== JSON.stringify(labelData)) {
      methods.reset(labelData);
    }
  }, [labelData, methods]);

  useEffect(() => {
    if (watchedIngredients) {
      setLabelData((prevLabelData) => ({
        ...prevLabelData,
        ingredients: watchedIngredients,
      }));
    }
  }, [watchedIngredients, setLabelData]);

  return (
    <FormProvider {...methods}>
      <Box className="p-4" data-testid="ingredients-form">
        <VerifiedBilingualTable
          path={"ingredients"}
          unitOptions={UNITS.ingredients}
          valueColumn
          loading={loading}
        />
      </Box>
    </FormProvider>
  );
}

export default IngredientsForm;
