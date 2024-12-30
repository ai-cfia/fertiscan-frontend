import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Popover,
  Box,
  IconButton,
  Tooltip
} from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CheckIcon from "@mui/icons-material/Check";
import useDevStore from "@/stores/devStore";
import useAlertStore from "@/stores/alertStore";
import { green } from "@mui/material/colors";

const DevMenu = () => {
  const setTriggerConfirmAll = useDevStore((state) => state.setTriggerConfirmAll);
  const showAlert = useAlertStore((state) => state.showAlert);
  const setTriggerLabelDataLoad = useDevStore((state) => state.setTriggerLabelDataLoad);
  const triggerLabelDataLoad = useDevStore((state) => state.triggerLabelDataLoad);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [wasHovered, setWasHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const firstActionRef = useRef<HTMLDivElement | null>(null);
  const [actionButtonStyle, setActionButtonStyle] = useState<{ bottom: number; left: number }>({ bottom: 0, left: 0 });

  useEffect(() => {
    // Set actionButtonStyle with the bounding positions
    const updateActionButtonStyle = () => {
      if (firstActionRef.current) {
        const { bottom, left } = firstActionRef.current.getBoundingClientRect();
        setActionButtonStyle({
          bottom: window.innerHeight - bottom, // Position from bottom of the viewport
          left, // Position from left of the viewport
        });
      }
    };

    // Update the position initially and on window resize
    updateActionButtonStyle();
    window.addEventListener('resize', updateActionButtonStyle);

    // Cleanup event listener
    return () => {
      window.removeEventListener('resize', updateActionButtonStyle);
    };
  }, []);


  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (isActive) {
        setPopoverOpen(false);
        setIsActive(false);
      } else {
      setAnchorEl(event.currentTarget);
      setPopoverOpen(true);
      setIsActive(true);
    }},
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
          icon={
            <Box position="relative">
              <FileCopyIcon />
              {triggerLabelDataLoad && (
                <CheckIcon
                sx={{
                  color: "white", // Keep this for contrast
                  position: 'absolute',
                  top: '-5px', // Adjust as needed for positioning
                  right: '35px', // Adjust as needed for positioning
                  zIndex: 10,
                  fontSize: '2.2rem', // Increase font size for prominence
                  fontWeight: 'bold',
                  backgroundColor: "green", // Add a background color for contrast
                  borderRadius: '50%', // Make it circular
                  padding: '2px', // Add padding for the background
                  boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)' // Add shadow for depth
                }}
              />
              )}
            </Box>
          }
          tooltipTitle="Load Data"
          onClick={() => setTriggerLabelDataLoad(triggerLabelDataLoad ? false : true)}
          sx={{ backgroundColor: '#05486c', color: '#fff', position: 'relative' }} // Ensure relative positioning
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
          tooltipTitle="See alerts examples"
          sx={{ backgroundColor: "#05486c", color: "#fff" }}
          onClick={handleClick}
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
          <Tooltip title="Nom d'utilisateur ou mot de passe invalide" arrow>
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
          </Tooltip>
          <Tooltip title="Le nom d'utilisateur est déjà pris" arrow>
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
          </Tooltip>
          <Tooltip title="Vous devez ajouter au moins 1 fichier pour commencer l'analyse" arrow>
          <IconButton
            color="primary"
            sx={{
              margin: 1,
              backgroundColor: "#05486c",
              "&:hover": { backgroundColor: "#033a56" }
            }}
            onClick={() => showAlert("One file minimum", "info")}
          >
            <PrintIcon sx={{ color: "#fff" }} />
          </IconButton>
          </Tooltip>
        </Box>
      </Popover>
    </>
  );
};

export default DevMenu;
