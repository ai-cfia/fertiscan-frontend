import { FormComponentProps, LabelData } from "@/types/types";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import VerifiedBilingualTable from "./VerifiedBilingualTable";

function CautionsForm({ labelData, setLabelData }: FormComponentProps) {
  const methods = useForm<LabelData>({
    defaultValues: labelData,
  });

  const { control } = methods;

  const watchedCautions = useWatch({
    control,
    name: "cautions",
  });

  useEffect(() => {
    if (watchedCautions) {
      setLabelData((prevLabelData) => ({
        ...prevLabelData,
        cautions: watchedCautions,
      }));
    }
  }, [watchedCautions, setLabelData]);

  return (
    <FormProvider {...methods}>
      <Box className="p-4" data-testid="cautions-form">
        <VerifiedBilingualTable path={"cautions"} />
      </Box>
    </FormProvider>
  );
}

export default CautionsForm;
