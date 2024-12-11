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
        <VerifiedBilingualTable path={"cautions"} loading={loading} />
      </Box>
    </FormProvider>
  );
};

export default CautionsForm;
