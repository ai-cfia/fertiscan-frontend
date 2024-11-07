"use client";
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useEffect, useRef } from 'react';
import useAlertStore from '../stores/alertStore';

const AUTO_DISMISS_TIME = Number(process.env.NEXT_PUBLIC_AUTO_DISMISS_TIME) || 5000;

const AlertBanner: React.FC = () => {
  const { alert, hideAlert } = useAlertStore();
  const autoDismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoDismissTimer = () => {
    autoDismissTimerRef.current = setTimeout(() => {
      hideAlert();
    }, AUTO_DISMISS_TIME);
  };

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
  }, [alert, hideAlert]);

  return (
    <Box sx={{ width: '100%' }}>
      <Collapse in={Boolean(alert)}>
        {alert && (
          <Alert
            severity={alert.type}
            onMouseEnter={clearAutoDismissTimer}
            onMouseLeave={startAutoDismissTimer}
            action={
              <IconButton
                size="small"
                onClick={hideAlert}
              >
                <CloseIcon color={alert.type} />
              </IconButton>
            }
          >
            <Typography
              variant='body2'
              color='inherit'
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
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
