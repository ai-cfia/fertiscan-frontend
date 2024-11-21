import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const ButtonStackModule: React.FC = () => {
  const handleClick1 = () => {
    alert('Button 1 Executed!');
  };

  const handleClick2 = () => {
    alert('Button 2 Executed!');
  };

  const handleClick3 = () => {
    alert('Button 3 Executed!');
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Button Stack Module</Typography>
      <Typography variant="body1" gutterBottom>
        This module contains a stack of three buttons to execute different commands.
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button variant="contained" color="primary" onClick={handleClick1}>
          Execute Command 1
        </Button>
        <Button variant="contained" color="primary" onClick={handleClick2}>
          Execute Command 2
        </Button>
        <Button variant="contained" color="primary" onClick={handleClick3}>
          Execute Command 3
        </Button>
      </Box>
    </Box>
  );
};

export default ButtonStackModule;
