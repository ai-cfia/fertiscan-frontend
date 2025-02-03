import { FormComponentProps, LabelData } from "@/types/types";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import VerifiedBilingualTable from "./VerifiedBilingualTable";
import isEqual from "lodash.isequal";

const InstructionsForm: React.FC<FormComponentProps> = ({
  labelData,
  setLabelData,
  loading = false,
}) => {
  const methods = useForm<LabelData>({
    defaultValues: labelData,
  });

  const watchedInstructions = useWatch({
    control: methods.control,
    name: "instructions",
  });

  useEffect(() => {
    const currentValues = methods.getValues();
    if (!isEqual(currentValues.instructions, labelData.instructions)) {
      methods.reset(labelData);
    }
  }, [labelData, methods]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (watchedInstructions) {
        setLabelData((prevLabelData) => ({
          ...prevLabelData,
          instructions: watchedInstructions,
        }));
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [watchedInstructions, setLabelData]);

  return (
    <FormProvider {...methods}>
      <Box className="p-4" data-testid="instructions-form">
        <VerifiedBilingualTable path={"instructions"} loading={loading} />
      </Box>
    </FormProvider>
  );
};

export default InstructionsForm;
