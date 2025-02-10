import { InspectionData } from "@/utils/server/backend";
import ErrorIcon from "@mui/icons-material/Error";
import { Box, Card, Stack, Tooltip, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

interface InspectionElementProps {
  inspection: InspectionData;
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
        "p-2 xs:h-[75px] s:h-[100px] cursor-pointer hover:shadow-xl flex-shrink-0"
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
        {!inspection.verified && (
          <Tooltip title={t("inspection.unverified")}>
            <ErrorIcon data-testid={"error-icon"} color="error"></ErrorIcon>
          </Tooltip>
        )}
      </Stack>
    </Card>
  );
};

export default InspectionElement;
