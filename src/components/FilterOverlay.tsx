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
  const { t } = useTranslation("header");
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
        {t("Filter options")}
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
            label={t("Name")}
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
            label={t("Registration number")}
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
            label={t("Date of inspection")}
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
            label={t("Organisation name")}
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
            label={t("Organisation address")}
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
        {t("Search with Filter")}
      </Button>
    </Box>
  );
};

export default FilterOverlay;
