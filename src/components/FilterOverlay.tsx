import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import CancelIcon from '@mui/icons-material/Cancel';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

interface FilterOverlayProps {
  setFilterOverlayOpen: (open: boolean) => void;
}

const FilterOverlay: React.FC<FilterOverlayProps> = ({ setFilterOverlayOpen }) => {
  const theme = useTheme();
  const { t } = useTranslation("searchPage");
  const [iconHover, setIconHover] = useState(false);

  return (
    <Box
      sx={{
        position: "fixed",
        top: "130px",
        left: "auto",
        right: "5%",
        zIndex: 4,
        width: { xs: "90%", md: "80%", lg: "40%" },
        maxWidth: "1400px",
        padding: "16px",
        borderRadius: "8px",
        backgroundColor: theme.palette.primary.main,
        boxShadow: theme.shadows[5],
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Typography variant="h5" sx={{ mb: 3 }}>
        {t("searchOption")}
      </Typography>

      <IconButton
        sx={{ position: "absolute", top: "5px", right: "5px" }}
        onMouseEnter={() => setIconHover(true)}
        onMouseLeave={() => setIconHover(false)}
        onClick={() => setFilterOverlayOpen(false)}
      >
        {iconHover ? <CancelIcon fontSize="medium"/> : <CancelOutlinedIcon fontSize="medium"/>}
      </IconButton>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: "16px",
        }}
      >
        <Box sx={{ flexDirection: "column" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {t("Fertiliser")}
          </Typography>
          <TextField
            id="fertiliser-name"
            variant="filled"
            label={t("fertiliserName")}
            sx={{
              width: "70%",
              marginLeft: "10px",
              marginTop: "10px",
              backgroundColor: theme.palette.background.paper,
            }}
          />
          <TextField
            id="registration-number"
            variant="filled"
            label={t("registrationNumber")}
            sx={{
              width: "70%",
              marginLeft: "10px",
              marginTop: "10px",
              backgroundColor: theme.palette.background.paper,
            }}
          />
          <TextField
            id="date-of-inspection"
            variant="filled"
            label={t("dateOfInspection")}
            sx={{
              width: "70%",
              marginLeft: "10px",
              marginTop: "10px",
              backgroundColor: theme.palette.background.paper,
            }}
          />
        </Box>
        <Box sx={{ flexDirection: "column" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {t("Organisation")}
          </Typography>

          <TextField
            id="organisation-name"
            variant="filled"
            label={t("organisationName")}
            sx={{
              width: "70%",
              marginLeft: "10px",
              marginTop: "10px",
              backgroundColor: theme.palette.background.paper,
            }}
          />
          <TextField
            id="organisation-address"
            variant="filled"
            label={t("organisationAddress")}
            sx={{
              width: "70%",
              marginLeft: "10px",
              marginTop: "10px",
              backgroundColor: theme.palette.background.paper,
            }}
          />
        </Box>
      </Box>
      <Button
        variant="contained"
        color="secondary"
        sx={{ mt: 3, alignSelf: "flex-end" }}
      >
        {t("searchButton")}
      </Button>
    </Box>
  );
};

export default FilterOverlay;
