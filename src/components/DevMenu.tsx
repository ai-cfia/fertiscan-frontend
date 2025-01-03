import React, { useState, useCallback, useRef, useEffect } from "react";
import {
    Box,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
} from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import useDevStore from "@/stores/devStore";
import CheckIcon from "@mui/icons-material/Check";

const DevMenu = () => {
    const triggerLabelDataLoad = useDevStore((state) => state.triggerLabelDataLoad);
    const setTriggerLabelDataLoad = useDevStore((state) => state.setTriggerLabelDataLoad);
    const [ popOverOpen, setPopOverOpen ] = useState(false);
    const [ speedDialOpen, setSpeedDialOpen ] = useState(false);
    const [ wasHovered, setWasHovered ] = useState(false);
    const firstActionRef = useRef<HTMLDivElement | null>(null);
    const [actionButtonStyle, setActionButtonStyle] = useState<{ bottom: number; left: number }>({ bottom: 0, left: 0 });

    const handleClose = useCallback(() => {
        if(wasHovered) {
            setPopOverOpen(false);
            setWasHovered(false);
        }
    }, [wasHovered]);

    const handleOpen = () => setSpeedDialOpen(true);

    const handleCloseSpeedDial = () => {
        if(popOverOpen){
            return;
        }else{
            setSpeedDialOpen(false);
        }
    };

    useEffect(() => {
        const updateActionButtonStyle = () => {
          if (firstActionRef.current) {
            const { bottom, left } = firstActionRef.current.getBoundingClientRect();
            setActionButtonStyle({
              bottom: window.innerHeight - bottom,
              left,
            });
          }
        };
        updateActionButtonStyle();
        window.addEventListener('resize', updateActionButtonStyle);
        return () => {
          window.removeEventListener('resize', updateActionButtonStyle);
        };
      }, []);

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
                  color: "#fff",
                  position: 'absolute',
                  top: '-5px',
                  right: '35px',
                  zIndex: 10,
                  fontSize: '2.2rem',
                  fontWeight: 'bold',
                  backgroundColor: "#008000",
                  borderRadius: '50%',
                  padding: '2px',
                  boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
                }}
              />
              )}
            </Box>
        }
          tooltipTitle="Load Data"
          onClick={() => setTriggerLabelDataLoad(triggerLabelDataLoad ? false : true)}
          sx={{ backgroundColor: '#05486c', color: '#fff', position: 'relative' }}
          onMouseEnter={handleClose}
        />
      </SpeedDial>
        </>
    );
};

export default DevMenu;
