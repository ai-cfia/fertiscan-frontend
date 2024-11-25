import { FormComponentProps } from "@/types/types";
import { Box } from "@mui/material";

function CautionsForm({ labelData, setLabelData }: FormComponentProps) {
  return (
    <Box className="p-4" data-testid="cautions-form">
      CautionsForm
    </Box>
  );
}

export default CautionsForm;
