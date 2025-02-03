import { FormComponentProps, LabelData, UNITS } from "@/types/types";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import VerifiedBilingualTable from "./VerifiedBilingualTable";
import isEqual from "lodash.isequal";


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
    if (!isEqual(currentValues.ingredients, labelData.ingredients)) {
      methods.reset(labelData);
    }
  }, [labelData, methods]);

  useEffect(() => {
    const handler = setTimeout(() => {
    if (watchedIngredients) {
      setLabelData((prevLabelData) => ({
        ...prevLabelData,
        ingredients: watchedIngredients,
      }));
    }
  }, 300);
  return () => clearTimeout(handler);
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
