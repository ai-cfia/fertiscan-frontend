import { FormComponentProps } from "@/types/types";
import { Box } from "@mui/material";

function GuaranteedAnalysisForm({
  labelData,
  setLabelData,
}: FormComponentProps) {
  console.log(labelData, setLabelData);
  return (
    <Box data-testid="guaranteed-analysis-form">GuaranteedAnalysisForm</Box>
  );
}

export default GuaranteedAnalysisForm;
