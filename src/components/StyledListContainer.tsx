import AddIcon from "@mui/icons-material/Add";
import { Box, BoxProps, Button } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

interface StyledListContainerProps extends BoxProps {
  path: string;
  verified?: boolean;
  onAppend: () => void;
  children: React.ReactNode;
}

const StyledListContainer: React.FC<StyledListContainerProps> = ({
  path,
  verified,
  onAppend,
  children,
  ...boxProps
}) => {
  const t = useTranslation("labelDataValidator").t;
  return (
    <Box
      className="flex flex-1 flex-col"
      data-testid={`fields-container-${path}`}
      {...boxProps}
    >
      {children}

      {/* Add Row Button */}
      <Button
        size="small"
        className={`!p-2 text-white bg-green-500 ${verified ? "!hidden" : ""}`}
        onClick={onAppend}
        startIcon={<AddIcon />}
        disabled={verified}
        data-testid={`add-button-${path}`}
      >
        {t("addRow")}
      </Button>
    </Box>
  );
};

export default StyledListContainer;
