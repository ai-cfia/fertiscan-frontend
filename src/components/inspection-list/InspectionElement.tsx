import { InspectionData } from "@/utils/server/backend";
import ErrorIcon from "@mui/icons-material/Error";
import { Box, Card, Stack, Tooltip, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * Props for the InspectionElement component.
 *
 * @interface InspectionElementProps
 * @property {InspectionData} inspection - The data for the inspection.
 * @property {string} key - A unique key for the inspection element.
 * @property {() => void} handleClick - Function to handle click events.
 */
interface InspectionElementProps {
  inspection: InspectionData;
  key: string;
  handleClick(): void;
}

/**
 * Component representing an inspection element in a list.
 *
 * @param {InspectionElementProps} props - The properties for the InspectionElement component.
 * @param {InspectionData} props.inspection - The inspection data.
 * @param {Function} props.handleClick - The function to handle click events on the card.
 * @returns {JSX.Element} The rendered InspectionElement component.
 */
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
            <ErrorIcon data-testid={"error-icon"} color="error" arial-label={t("inspection.alt.errorIcon")}></ErrorIcon>
          </Tooltip>
        )}
      </Stack>
    </Card>
  );
};

export default InspectionElement;
