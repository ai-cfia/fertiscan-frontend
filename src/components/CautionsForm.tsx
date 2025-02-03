import { FormComponentProps, LabelData } from "@/types/types";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import VerifiedBilingualTable from "./VerifiedBilingualTable";

const CautionsForm: React.FC<FormComponentProps> = ({
  labelData,
  setLabelData,
  loading = false,
}) => {
  const methods = useForm<LabelData>({
    defaultValues: labelData,
  });

  const watchedCautions = useWatch({
    control: methods.control,
    name: "cautions",
  });

  useEffect(() => {
    const currentValues = methods.getValues();
    if (JSON.stringify(currentValues) !== JSON.stringify(labelData)) {
      methods.reset(labelData);
    }
  }, [labelData, methods]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (watchedCautions) {
        setLabelData((prevLabelData) => ({
          ...prevLabelData,
          cautions: watchedCautions,
        }));
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [watchedCautions, setLabelData]);

  return (
    <FormProvider {...methods}>
      <Box className="p-4" data-testid="cautions-form">
        <VerifiedBilingualTable path={"cautions"} loading={loading} />
      </Box>
    </FormProvider>
  );
};

export default CautionsForm;
