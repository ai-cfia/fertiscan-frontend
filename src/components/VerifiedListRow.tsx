import { Box, Divider } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import StyledDeleteButton from "./StyledDeleteButton";

interface VerifiedListRowProps {
  verified?: boolean;
  hideDelete?: boolean;
  onDelete?: () => void;
  isLastItem?: boolean;
  children: React.ReactNode;
}

const VerifiedListRow: React.FC<VerifiedListRowProps> = ({
  verified,
  hideDelete,
  onDelete,
  isLastItem,
  children,
}) => {
  const { t } = useTranslation("labelDataValidator");
  return (
    <Box className="ml-2" data-testid={`field-row`}>
      <Box className="flex items-center">
        {children}

        <StyledDeleteButton
          tooltip={t("deleteVerifiedListRow")}
          hideButton={verified || hideDelete}
          onClick={onDelete}
          aria-label={t("verifiedListRow.accessibility.deleteRowButtons")}
        />
      </Box>

      <Divider
        className={`!my-1 ${verified ? "bg-green-500" : "bg-inherit"} ${isLastItem && verified ? "hidden" : ""}`}
      />
    </Box>
  );
};

export default VerifiedListRow;
