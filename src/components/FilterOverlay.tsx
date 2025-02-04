import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import CancelIcon from "@mui/icons-material/Cancel";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

interface FilterOverlayProps {
  closeOverlay: () => void;
}

const FilterOverlay: React.FC<FilterOverlayProps> = ({ closeOverlay }) => {
  const theme = useTheme();
  const { t } = useTranslation("searchPage");

  type InputValuesKeys = 'fertiliserName' | 'registrationNumber' | 'dateOfInspection' | 'organisationName' | 'organisationAddress';

  const [inputValues, setInputValues] = useState<Record<InputValuesKeys, string>>({
    fertiliserName: '',
    registrationNumber: '',
    dateOfInspection: '',
    organisationName: '',
    organisationAddress: '',
  });
  const [selected, setSelected] = useState("specific");
  const [iconHover, setIconHover] = useState(false);

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelected(event.target.value as string);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setInputValues((prev) => ({ ...prev, [id as InputValuesKeys]: value }));
  };

  const clearFilters = () => {
    setInputValues({
      fertiliserName: '',
      registrationNumber: '',
      dateOfInspection: '',
      organisationName: '',
      organisationAddress: '',
    });
    setSelected("specific");
  };

  return (
    <Box
      sx={{
        padding: "16px",
        backgroundColor: theme.palette.secondary.main,
        display: "flex",
        flexDirection: "column",
        width: {
          xs: "90vw",
          sm: "70vw",
          md: "60vw",
          lg: "50vw",
        },
        maxHeight: "calc(100vh - 100px)",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, color: "white" }}>
        {t("searchOption")}
      </Typography>

      <IconButton
        sx={{ position: "absolute", top: "5px", right: "5px", color: "white" }}
        onMouseEnter={() => setIconHover(true)}
        onMouseLeave={() => setIconHover(false)}
        onClick={closeOverlay} // Use passed down function to close popover
      >
        {iconHover ? (
          <CancelIcon fontSize="medium" />
        ) : (
          <CancelOutlinedIcon fontSize="medium" />
        )}
      </IconButton>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Box sx={{ flexDirection: "column", display: "flex", gap: "10px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>
            {t("Fertiliser")}
          </Typography>
          {(["fertiliserName", "registrationNumber"] as InputValuesKeys[]).map((id) => (
            <TextField
              key={id}
              id={id}
              value={inputValues[id]}
              onChange={handleInputChange}
              variant="filled"
              label={t(id)}
              size="small"
              sx={{
                width: "100%",
                "& .MuiInputLabel-root": {
                  color: "black",
                },
                "& .MuiFilledInput-root": {
                  backgroundColor: "#ffffff2b",
                  "&:before": { borderBottom: "1px solid white" },
                  "&:hover:not(.Mui-disabled):before": {
                    borderBottom: "2px solid white",
                  },
                  "&:after": { borderBottom: "2px solid white" },
                },
              }}
            />
          ))}
          <TextField
            id="dateOfInspection"
            value={inputValues.dateOfInspection}
            onChange={handleInputChange}
            variant="filled"
            label={t("dateOfInspection")}
            size="small"
            sx={{
              width: "100%",
              "& .MuiInputLabel-root": {
                color: "black",
              },
              "& .MuiFilledInput-root": {
                backgroundColor: "#ffffff2b",
                "&:before": { borderBottom: "1px solid white" },
                "&:hover:not(.Mui-disabled):before": {
                  borderBottom: "2px solid white",
                },
                "&:after": { borderBottom: "2px solid white" },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Select
                    variant="standard"
                    size="small"
                    value={selected}
                    onChange={handleChange}
                  >
                    <MenuItem value="specific">{t("specific")}</MenuItem>
                    <MenuItem value="before">{t("before")}</MenuItem>
                    <MenuItem value="after">{t("after")}</MenuItem>
                  </Select>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box sx={{ flexDirection: "column", display: "flex", gap: "10px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>
            {t("Organisation")}
          </Typography>
          {(["organisationName", "organisationAddress"] as InputValuesKeys[]).map((id) => (
            <TextField
              key={id}
              id={id}
              value={inputValues[id]}
              onChange={handleInputChange}
              variant="filled"
              label={t(id)}
              size="small"
              sx={{
                width: "100%",
                "& .MuiInputLabel-root": {
                  color: "black",
                },
                "& .MuiFilledInput-root": {
                  backgroundColor: "#ffffff2b",
                  "&:before": { borderBottom: "1px solid white" },
                  "&:hover:not(.Mui-disabled):before": {
                    borderBottom: "2px solid white",
                  },
                  "&:after": { borderBottom: "2px solid white" },
                },
              }}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button variant="contained" color="secondary" onClick={clearFilters}>
          {t("clearFilters")}
        </Button>
        <Button variant="contained" color="secondary">
          {t("searchButton")}
        </Button>
      </Box>
    </Box>
  );
};

export default FilterOverlay;
