"use client";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useRef } from "react";
import useAlertStore from "../stores/alertStore";
import { useTranslation } from "react-i18next";

const AUTO_DISMISS_TIME =
  Number(process.env.NEXT_PUBLIC_ALERT_BANNER_AUTO_DISMISS_TIME) || 5000;

const AlertBanner: React.FC = () => {
  const { alert, hideAlert } = useAlertStore();
  const autoDismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoDismissTimer = useCallback(() => {
    autoDismissTimerRef.current = setTimeout(() => {
      hideAlert();
    }, AUTO_DISMISS_TIME);
  }, [hideAlert]);

  const clearAutoDismissTimer = () => {
    if (autoDismissTimerRef.current) {
      clearTimeout(autoDismissTimerRef.current);
      autoDismissTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (alert) {
      startAutoDismissTimer();
    }
    return () => clearAutoDismissTimer();
  }, [alert, hideAlert, startAutoDismissTimer]);

  const { t } = useTranslation("alertBanner");

  return (
    <Box className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-lg"
      data-testid="alert-banner-container">
      <Collapse in={Boolean(alert)}>
        {alert && (
          <Alert
            severity={alert.type}
            onMouseEnter={clearAutoDismissTimer}
            onMouseLeave={startAutoDismissTimer}
            data-testid="alert-banner"
            action={
              <IconButton
                size="small"
                onClick={hideAlert}
                data-testid="alert-close-button"
                aria-label={t("alt.closeIcon")}
              >
                <CloseIcon color={alert.type} />
              </IconButton>
            }
          >
            <Typography
              className="overflow-hidden text-ellipsis"
              variant="body2"
              color="inherit"
              data-testid="alert-message"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {alert.message}
            </Typography>
          </Alert>
        )}
      </Collapse>
    </Box>
  );
};

export default AlertBanner;
