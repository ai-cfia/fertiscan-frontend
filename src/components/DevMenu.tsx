import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import useDevStore from "@/stores/devStore";
import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import RemoveDoneIcon from "@mui/icons-material/RemoveDone";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";
import useAlertStore from "@/stores/alertStore";
import { useTranslation } from "react-i18next";

const DevMenu = () => {
  const triggerLabelDataLoad = useDevStore(
    (state) => state.triggerLabelDataLoad,
  );
  const setTriggerLabelDataLoad = useDevStore(
    (state) => state.setTriggerLabelDataLoad,
  );
  const setTriggerConfirmAll = useDevStore(
    (state) => state.setTriggerConfirmAll,
  );
  const triggerConfirmAll = useDevStore((state) => state.triggerConfirmAll);
  const [popOverOpen, setPopOverOpen] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [alertListOpen, setAlertListOpen] = useState(false);
  const showAlert = useAlertStore((state) => state.showAlert);
  const { i18n, t } = useTranslation();
  const jsonUploaded = useDevStore((state) => state.uploadedJsonFile);

  const [errorMessages, setErrorMessages] = useState<[string, string][]>([]);

  const extractErrorKeys = (
    obj: { [key: string]: any },
    prefix = "",
  ): [string, string][] => {
    let errors: [string, string][] = [];

    for (const key of Object.keys(obj)) {
      const currentKey = prefix ? `${prefix}.${key}` : key;

      if (
        key === "errors" &&
        typeof obj[key] === "object" &&
        obj[key] !== null
      ) {
        for (const errorKey of Object.keys(obj[key])) {
          const errorDescription = `${obj[key][errorKey]}`;
          const errorPath = `${currentKey}.${errorKey}`;
          errors.push([errorDescription, errorPath]);
        }
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        // Continue traversing if it's a nested object
        const nestedErrors = extractErrorKeys(obj[key], currentKey);
        errors = errors.concat(nestedErrors);
      }
    }

    return errors;
  };

  useEffect(() => {
    const translation = i18n.getDataByLanguage(i18n.language) || {};
    console.log("translation: ", translation);

    const allErrors: [string, string][] = [];
    Object.keys(translation).forEach((key: string) => {
      allErrors.push(...extractErrorKeys(translation[key] || {}, key));
    });

    setErrorMessages(allErrors);
    console.log("errorMessages: ", allErrors);
  }, [i18n, i18n.language]);

  const handleAlertActionHover = (value: boolean) => {
    setAlertListOpen(value);
  };

  const handleOpen = () => setSpeedDialOpen(true);

  const handleCloseSpeedDial = () => {
    if (popOverOpen) {
      return;
    } else {
      setSpeedDialOpen(false);
      setAlertListOpen(false);
    }
  };

  const downloadJson = () => {
    if (!jsonUploaded) {
      showAlert("No file to download", "error");
      return;
    }

    const url = URL.createObjectURL(jsonUploaded);
    const element = document.createElement("a");
    element.href = url;
    element.download = jsonUploaded.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
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
        {window.location.pathname !== "/label-data-validation" && (
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
          />
        )}
        {window.location.pathname === "/label-data-validation" && (
          <SpeedDialAction
            icon={
              triggerConfirmAll ? (
                <DoneAllIcon />
              ) : (
                <RemoveDoneIcon aria-hidden="true" />
              )
            }
            tooltipTitle={triggerConfirmAll ? "Confirm All" : "Unconfirm All"}
            sx={{
              backgroundColor: "#05486c",
              color: "#fff",
              "&:hover": {
                backgroundColor: triggerConfirmAll
                  ? "#4caf50 !important"
                  : "#950606",
              },
            }}
            onClick={() => {
              setTriggerConfirmAll(!triggerConfirmAll),
                console.log("triggerConfirmAll: ", triggerConfirmAll);
            }}
          />
        )}
        {window.location.pathname === "/label-data-validation" && (
          <SpeedDialAction
            icon={<DownloadIcon />}
            tooltipTitle="Download JSON"
            sx={{
              backgroundColor: "#05486c",
              color: "#fff",
            }}
            onClick={() => downloadJson()}
          />
        )}
        <SpeedDialAction
          icon={
            <Box position="relative">
              <SaveIcon />
              {alertListOpen && (
                <List
                  sx={{
                    position: "absolute",
                    right: "35px",
                    zIndex: 10,
                    backgroundColor: "#05486c",
                    gap: "15px",
                    height: "300px",
                    width: "400px",
                    alignItems: "start",
                    boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
                    display: "flex",
                    maxHeight: "100px",
                    overflowY: "auto",
                    flexDirection: "column",
                    paddingTop: "20px",
                    paddingLeft: "20px",
                  }}
                >
                  {errorMessages.map(([fullErrorKey, text], i) => (
                    <ListItemButton
                      key={i}
                      sx={{
                        height: "10px",
                        padding: "0px",
                        marginTop: "-5px",
                        marginBottom: "5px",
                      }}
                      onClick={() => showAlert(t(fullErrorKey), "error")}
                    >
                      {text}
                    </ListItemButton>
                  ))}
                </List>
              )}
            </Box>
          }
          tooltipTitle="Test show alert list"
          sx={{
            backgroundColor: "#05486c",
            color: "#fff",
          }}
          onMouseEnter={() => handleAlertActionHover(true)}
        />
      </SpeedDial>
    </>
  );
};

export default DevMenu;
