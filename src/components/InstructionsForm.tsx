import { FormComponentProps, LabelData } from "@/types/types";
import useDebouncedSave from "@/utils/client/useDebouncedSave";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import VerifiedBilingualTable from "./VerifiedBilingualTable";

const InstructionsForm: React.FC<FormComponentProps> = ({
  labelData,
  setLabelData,
  loading = false,
}) => {
  const methods = useForm<LabelData>({
    defaultValues: labelData,
  });
  const sectionName = "instructions";

  const watchedInstructions = useWatch({
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
    save(sectionName, watchedInstructions);
  }, [watchedInstructions, save]);

  return (
    <FormProvider {...methods}>
      <Box className="p-4" data-testid="instructions-form">
        <VerifiedBilingualTable path={sectionName} loading={loading} />
      </Box>
    </FormProvider>
  );
};

export default InstructionsForm;
