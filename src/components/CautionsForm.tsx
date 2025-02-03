import { FormComponentProps, LabelData } from "@/types/types";
import useDebouncedSave from "@/utils/client/useDebouncedSave";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import VerifiedBilingualTable from "./VerifiedBilingualTable";
import isEqual from "lodash.isequal";

const CautionsForm: React.FC<FormComponentProps> = ({
  labelData,
  setLabelData,
  loading = false,
}) => {
  const methods = useForm<LabelData>({
    defaultValues: labelData,
  });
  const sectionName = "cautions";

  const watchedCautions = useWatch({
    control: methods.control,
    name: sectionName,
  });

  const save = useDebouncedSave(setLabelData);

  useEffect(() => {
    const currentValues = methods.getValues();
    if (!isEqual(currentValues.cautions, labelData.cautions)) {
      methods.reset(labelData);
    }
  }, [labelData, methods]);

  useEffect(() => {
    const handler = setTimeout(() => {
        save(sectionName, watchedCautions);
    }, 300);
    return () => clearTimeout(handler);
  }, [watchedCautions, save]);

  return (
    <FormProvider {...methods}>
      <Box className="p-4" data-testid="cautions-form">
        <VerifiedBilingualTable path={sectionName} loading={loading} />
      </Box>
    </FormProvider>
  );
};

export default CautionsForm;
