import { FormComponentProps, LabelData } from "@/types/types";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import VerifiedBilingualTable from "./VerifiedBilingualTable";

const InstructionsForm: React.FC<FormComponentProps> = ({
  labelData,
  setLabelData,
}) => {
  const methods = useForm<LabelData>({
    defaultValues: labelData,
  });

  const watchedInstructions = useWatch({
    control: methods.control,
    name: "instructions",
  });

  useEffect(() => {
    if (watchedInstructions) {
      setLabelData((prevLabelData) => ({
        ...prevLabelData,
        instructions: watchedInstructions,
      }));
    }
  }, [watchedInstructions, setLabelData]);

  return (
    <FormProvider {...methods}>
      <Box className="p-4" data-testid="instructions-form">
        <VerifiedBilingualTable path={"instructions"} />
      </Box>
    </FormProvider>
  );
};

export default InstructionsForm;
