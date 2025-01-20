import { Box, Card, Stack, Tooltip, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import React from "react";
import InspectionPreview from "@/types/InspectionPreview";
import { useTranslation } from "react-i18next";

interface InspectionElementProps {
  inspection: InspectionPreview;
  key: string;
  handleClick(): void;
}

const InspectionElement = ({
  inspection,
  handleClick,
}: InspectionElementProps) => {

  const { t } = useTranslation("dashboard");

  return (
    <Card
      className={
        "p-2 xs:h-[75px] s:h-[100px] cursor-pointer flex-shrink-0"
      }
      onClick={handleClick}
    >
      <Stack direction={"row"} className={"h-full items-center"}>
        <Box
          data-testid="image"
          component="img"
          alt={inspection.product_name || "Fertilizer picture"}
          src={"/img/image.png"}
          className={`max-h-full h-full`}
        />
        <Typography component={"h2"} className={`!ml-2 w-full`}>
          {inspection.product_name}
        </Typography>
        {inspection.updated_at === inspection.upload_date && (
          <Tooltip title={t("inspection.unverified")}>
            <ErrorIcon data-testid={"error-icon"} color="error"></ErrorIcon>
          </Tooltip>
        )}
      </Stack>
    </Card>
  );
};

const LoadingInspectionElement = () => {
  return (
    <Card className={"p-2 xs:h-[75px] s:h-[100px] flex-shrink-0"}>
      <Stack direction={"row"} className={"h-full items-center"}>
        <Typography component={"h2"} className={`!ml-2 w-full`}>
          {"Loading..."}
        </Typography>
      </Stack>
    </Card>
  );
}

export default InspectionElement;
export { LoadingInspectionElement, InspectionElement };
