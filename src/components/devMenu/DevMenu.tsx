import React, { useState, useCallback } from "react";
import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Popover,
  Box,
  IconButton
} from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import useDevStore from "@/stores/devStore";
import useAlertStore from "@/stores/alertStore";

const DevMenu = () => {
  const setTriggerConfirmAll = useDevStore((state) => state.setTriggerConfirmAll);
  const showAlert = useAlertStore((state) => state.showAlert);
  const setTriggerLabelDataLoad = useDevStore((state) => state.setTriggerLabelDataLoad);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [wasHovered, setWasHovered] = useState(false);

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      setPopoverOpen(true);
    },
    []
  );

  const handleClose = useCallback(() => {
    if (wasHovered) {
      setPopoverOpen(false);
      setWasHovered(false);
    }
  }, [wasHovered]);

  const handleOpen = () => setSpeedDialOpen(true);
  const handleCloseSpeedDial = () => {
    if (popoverOpen) {
      return;
    } else {
      setSpeedDialOpen(false);
    }
  };

  return (
    <>
      <SpeedDial
        ariaLabel="Dev Menu"
        icon={<SpeedDialIcon />}
        sx={{
          position: "fixed",
          bottom: "64px",
          right: "64px",
          "& .MuiFab-primary": { backgroundColor: "#05486c" }
        }}
        onOpen={handleOpen}
        onClose={handleCloseSpeedDial}
        open={speedDialOpen}
      >
        <SpeedDialAction
          icon={<FileCopyIcon />}
          tooltipTitle="Load Data"
          onClick={() => setTriggerLabelDataLoad(true)}
          sx={{ backgroundColor: "#05486c", color: "#fff" }}
          onMouseEnter={handleClose}
        />
        <SpeedDialAction
          icon={<DoneAllIcon />}
          tooltipTitle="Confirm All"
          sx={{
            backgroundColor: "#05486c",
            color: "#fff",
            "&:hover": { backgroundColor: "#4caf50 !important" }
          }}
          onClick={() => setTriggerConfirmAll(true)}
          onMouseEnter={handleClose}
        />
        <SpeedDialAction
          icon={<SaveIcon />}
          tooltipTitle="Options"
          sx={{ backgroundColor: "#05486c", color: "#fff" }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleClose}
        />
      </SpeedDial>

      <Popover
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "left"
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "right"
        }}
        disableRestoreFocus
        onMouseEnter={() => {
          setPopoverOpen(true);
          setWasHovered(true);
        }}
        onMouseLeave={handleClose}
        sx={{
          marginLeft: "-10px",
          "& .MuiPaper-root": {
            backgroundColor: "rgba(255, 255, 255, 0.0)",
            boxShadow: "none"
          }
        }}
      >
        <Box
          display="flex"
          className="bg-transparent"
          onMouseLeave={handleClose}
        >
          <IconButton
            color="primary"
            sx={{
              margin: 1,
              backgroundColor: "#05486c",
              "&:hover": { backgroundColor: "#033a56" }
            }}
            onClick={() => showAlert("Nom d'utilisateur ou mot de passe invalide", "error")}
          >
            <PrintIcon sx={{ color: "#fff" }} />
          </IconButton>
          <IconButton
            color="primary"
            sx={{
              margin: 1,
              backgroundColor: "#05486c",
              "&:hover": { backgroundColor: "#033a56" }
            }}
            onClick={() => showAlert("Le nom d'utilisateur est déjà pris", "error")}
          >
            <PrintIcon sx={{ color: "#fff" }} />
          </IconButton>
          <IconButton
            color="primary"
            sx={{
              margin: 1,
              backgroundColor: "#05486c",
              "&:hover": { backgroundColor: "#033a56" }
            }}
            onClick={() => showAlert("Vous devez ajouter au moins 1 fichier pour commencer l'analyse", "info")}
          >
            <PrintIcon sx={{ color: "#fff" }} />
          </IconButton>
        </Box>
      </Popover>
    </>
  );
};

export default DevMenu;
