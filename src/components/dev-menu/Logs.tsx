import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

type Log = {
  message: string;
  count: number;
  type: 'log' | 'warn' | 'error' | 'info';
};

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [deletedLogs, setDeletedLogs] = useState<{ message: string, type: string }[]>([]);
  const [height, setHeight] = useState<number>(400);  // Initial height
  const [isResizing, setIsResizing] = useState<boolean>(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing) {
      const newHeight = e.clientY - document.getElementById('resizable-box')!.offsetTop;
      if (newHeight > 100 && newHeight < window.innerHeight - 100) {  // Constraints for min and max height
        setHeight(newHeight);
      }
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleMessage = (event: MessageEvent) => {
    const { type, msg } = event.data;
    setLogs((prevLogs) => {
      const existingLog = prevLogs.find((log) => log.message === msg && log.type === type);
      if (existingLog) {
        return prevLogs.map((log) =>
          log.message === msg && log.type === type ? { ...log, count: log.count + 1 } : log
        );
      }
      if (deletedLogs.some((log) => log.message === msg && log.type === type)) {
        // If the log was previously deleted, reset the count to 1
        setDeletedLogs((prev) => prev.filter((log) => !(log.message === msg && log.type === type)));
      }
      return [...prevLogs, { message: msg, count: 1, type }];  // Initial count set to 1
    });
  };

  useEffect(() => {
    const channel = new BroadcastChannel('drawer_channel');
    channel.onmessage = handleMessage;
    return () => {
      channel.close();
    };
  }, [deletedLogs]);  // Watch deletedLogs so the effect runs when a log is deleted

  const handleDelete = (message: string, type: string) => {
    setLogs((prevLogs) => prevLogs.filter((log) => !(log.message === message && log.type === type)));
    setDeletedLogs((prev) => [...prev, { message, type }]);
  };

  const handleClearAll = () => {
    setLogs([]);  // Clear all logs
    setDeletedLogs([]);  // Clear the tracking of deleted logs
  };

  return (
    <Box id="resizable-box" sx={{ height, resize: 'vertical', overflow: 'hidden', marginTop: 2, padding: 1, border: '1px solid grey', borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Typography variant="h6">Logs</Typography>
        <Button onClick={handleClearAll} variant="outlined" color="secondary" size="small">
          Clear All
        </Button>
      </Box>
      <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
        {logs.map((log, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginY: 1 }}>
            {log.count > 1 && (
              <Box className="rounded-full" sx={{ display: 'flex', marginRight: 1 }}>
                {log.count}
              </Box>
            )}
            <Typography
              variant="body2"
              color={
                log.type === 'error' ? 'error' :
                log.type === 'warn' ? 'warning' :
                log.type === 'info' ? 'info' : 'textPrimary'
              }
            >
              {log.message}
            </Typography>
            <IconButton onClick={() => handleDelete(log.message, log.type)} size="small">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>

    </Box>
  );
};

export default Logs;
