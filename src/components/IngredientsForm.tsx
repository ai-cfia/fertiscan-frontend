import { FormComponentProps } from "@/types/types";
import { Box } from "@mui/material";

function IngredientsForm({ labelData, setLabelData }: FormComponentProps) {
  console.log(labelData, setLabelData);
  return (
    <Box className="p-4" data-testid="ingredients-form">
      IngredientsForm
    </Box>
  );
}

export default IngredientsForm;
