// components/SideDrawer.tsx
import React, { useState, useEffect, ReactNode } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ReactDOM from 'react-dom';

const DevMenu: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [externalWindow, setExternalWindow] = useState<Window | null>(null);
  const [channel, setChannel] = useState<BroadcastChannel | null>(null);

  useEffect(() => {
    const newChannel = new BroadcastChannel('drawer_channel');
    setChannel(newChannel);

    newChannel.onmessage = (event: MessageEvent) => {
      if (event.data === 'close_external_window') {
        if (externalWindow) {
          externalWindow.close();
          setExternalWindow(null);
        }
      }
    };

    return () => {
      newChannel.close();
    };
  }, [externalWindow]);

  const toggleDrawer = () => {
    if (externalWindow) {
      externalWindow.close();
      setExternalWindow(null);
      if (channel) {
        channel.postMessage('close_external_window');
      }
    } else {
      setIsDrawerOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    function handleWindowClose() {
      if (externalWindow) {
        externalWindow.close();
        setExternalWindow(null);
        setIsDrawerOpen(false);
      }
    }

    if (externalWindow) {
      externalWindow.addEventListener('beforeunload', handleWindowClose);
    }

    return () => {
      if (externalWindow) {
        externalWindow.removeEventListener('beforeunload', handleWindowClose);
      }
    };
  }, [externalWindow]);

  const moveToNewWindow = () => {
    if (!externalWindow) {
      const features = `width=400,height=600,left=${window.screenX + window.innerWidth},top=${window.screenY}`;
      const newWindow = window.open('', '', features);
      if (newWindow) {
        setIsDrawerOpen(false);
        newWindow.document.write('<div id="external-drawer-root"></div>');
        setExternalWindow(newWindow);
      }
    }
  };

  const drawerContent: ReactNode = (
    <Box sx={{ width: 250, padding: 2 }}>
      <Typography variant="h6">Debug/Dev Menu</Typography>
      <Button onClick={moveToNewWindow}>Move to New Window</Button>
    </Box>
  );

  return (
    <>
      <Button onClick={toggleDrawer}>{externalWindow ? 'Close External Window' : 'Toggle Drawer'}</Button>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer}
      >
        {drawerContent}
      </Drawer>
      {externalWindow &&
        ReactDOM.createPortal(drawerContent, externalWindow.document.getElementById('external-drawer-root') as Element)}
    </>
  );
};

export default DevMenu;
