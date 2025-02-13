import useBreakpoints from "@/utils/client/useBreakpoints";
import { IconButton, SvgIcon, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";

interface ExpandButtonProps {
  isRetracted: boolean;
  setIsRetracted: (value: boolean) => void;
}

const ExpandButton: React.FC<ExpandButtonProps> = ({
  isRetracted,
  setIsRetracted,
}) => {
  const { t } = useTranslation("confirmationPage");
  const { isDownXs, isBetweenXsSm, isBetweenSmMd, isBetweenMdLg } =
    useBreakpoints();
  const isLgOrBelow =
    isDownXs || isBetweenXsSm || isBetweenSmMd || isBetweenMdLg;
  return (
    <IconButton
      className="!absolute top-1 left-1 z-10 !bg-white"
      onClick={() => setIsRetracted(!isRetracted)}
      data-testid="retract-button"
      aria-label={
        isRetracted
          ? t("expandRetractButton.expandButton")
          : t("expandRetractButton.retractButton")
      }
    >
      <Tooltip
        title={
          isRetracted
            ? t("expandRetractButton.expandButton")
            : t("expandRetractButton.retractButton")
        }
      >
        <SvgIcon
          className={
            isRetracted
              ? isLgOrBelow
                ? "rotate-90"
                : "rotate-0"
              : isLgOrBelow
                ? "rotate-270"
                : "rotate-180"
          }
          data-testid="expand-icon"
        >
          <image href="/img/expandIcon.svg" height="24" width="24" />
        </SvgIcon>
      </Tooltip>
    </IconButton>
  );
};

export default ExpandButton;
