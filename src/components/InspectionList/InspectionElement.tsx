import { Box, Card, Stack, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import React from "react";
import InspectionPreview from "@/types/InspectionPreview";

interface InspectionElementProps {
  inspection: InspectionPreview;
  key: string;
  handleClick(): void;
}

const InspectionElement = ({inspection, key, handleClick}: InspectionElementProps) => {
  return <Card key={key} className={"p-2 xs:h-[75px] s:h-[100px] cursor-pointer hover:shadow-xl flex-shrink-0"} onClick={handleClick}>
    <Stack direction={"row"} className={"h-full items-center"}>
      <Box
        data-testid="hovered-image"
        component="img"
        alt={inspection.product_name||"Fertilizer picture"}
        src={"/img/image.png"}
        className={`max-h-full h-full`}
      />
      <Typography component={"h2"} className={`!ml-2 w-full`}>{inspection.product_name}</Typography>
      {inspection.updated_at===inspection.upload_date && <ErrorIcon color="error"></ErrorIcon>}
    </Stack>
  </Card>
}

export default InspectionElement;