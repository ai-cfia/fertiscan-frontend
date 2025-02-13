import { RegistrationNumber, RegistrationType } from "@/types/types";
import { Box, Chip } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

export interface RegistrationChipProps
  extends React.ComponentProps<typeof Box> {
  registrations: RegistrationNumber[] | undefined;
}

export const RegistrationChips = React.forwardRef<
  HTMLDivElement,
  RegistrationChipProps
>(({ registrations, ...rest }, ref) => {
  const { t } = useTranslation("confirmationPage");

  const getRegistrationLabel = (type: RegistrationType) => {
    switch (type) {
      case RegistrationType.FERTILIZER:
        return "baseInformation.regType.fertilizer";
      case RegistrationType.INGREDIENT:
        return "baseInformation.regType.ingredient";
      default:
        return type;
    }
  };

  return (
    <Box
      {...rest}
      ref={ref}
      className={`flex flex-wrap gap-1 ${rest.className || ""}`}
    >
      {registrations
        ?.filter((reg) => reg.identifier)
        .map((reg, i) => (
          <Chip
            key={i}
            label={`${reg.identifier} (${t(getRegistrationLabel(reg.type))})`}
            variant="outlined"
          />
        ))}
    </Box>
  );
});

RegistrationChips.displayName = "RegistrationChips";
