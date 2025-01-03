import React, { useState, useCallback, useRef, useEffect } from "react";
import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon, SvgIcon } from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import useDevStore from "@/stores/devStore";
import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import RemoveDoneIcon from "@mui/icons-material/RemoveDone";

const DevMenu = () => {
  const triggerLabelDataLoad = useDevStore(
    (state) => state.triggerLabelDataLoad,
  );
  const setTriggerLabelDataLoad = useDevStore(
    (state) => state.setTriggerLabelDataLoad,
  );
  const setTriggerConfirmAll = useDevStore((state) => state.setTriggerConfirmAll);
  const triggerConfirmAll = useDevStore((state) => state.triggerConfirmAll);
  const [popOverOpen, setPopOverOpen] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [wasHovered, setWasHovered] = useState(false);
  const [confirmAllHovered, setConfirmAllHovered] = useState(false);

  const handleClose = useCallback(() => {
    if (wasHovered) {
      setPopOverOpen(false);
      setWasHovered(false);
    }
  }, [wasHovered]);

  const handleOpen = () => setSpeedDialOpen(true);

  const handleCloseSpeedDial = () => {
    if (popOverOpen) {
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
          "& .MuiFab-primary": { backgroundColor: "#05486c" },
        }}
        onOpen={handleOpen}
        onClose={handleCloseSpeedDial}
        open={speedDialOpen}
      >
    { window.location.pathname !== "/label-data-validation" &&
        <SpeedDialAction
          icon={
            <Box position="relative">
              <FileCopyIcon />
              {triggerLabelDataLoad && (
                <CheckIcon
                  sx={{
                    color: "#fff",
                    position: "absolute",
                    top: "-5px",
                    right: "35px",
                    zIndex: 10,
                    fontSize: "2.2rem",
                    fontWeight: "bold",
                    backgroundColor: "#008000",
                    borderRadius: "50%",
                    padding: "2px",
                    boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
                  }}
                />
              )}
            </Box>
          }
          tooltipTitle="Load Data"
          onClick={() =>
            setTriggerLabelDataLoad(triggerLabelDataLoad ? false : true)
          }
          sx={{
            backgroundColor: "#05486c",
            color: "#fff",
            position: "relative",
          }}
          onMouseEnter={handleClose}
        />
        }
        { window.location.pathname === "/label-data-validation" &&
        <SpeedDialAction
          icon={
            triggerConfirmAll ? <DoneAllIcon /> :
            <RemoveDoneIcon aria-hidden="true" />
        }
          tooltipTitle= {triggerConfirmAll ?"Confirm All":"Unconfirm All"}
          sx={{
            backgroundColor: "#05486c",
            color: "#fff",
            "&:hover": { backgroundColor: triggerConfirmAll ? "#4caf50 !important" : "#950606" },
          }}
          onMouseOver={() => setConfirmAllHovered(true)}
          onClick={() => {setTriggerConfirmAll(!triggerConfirmAll), console.log("triggerConfirmAll: ", triggerConfirmAll)}}
          onMouseEnter={handleClose}
        />
        }
      </SpeedDial>
    </>
  );
};

export default DevMenu;
