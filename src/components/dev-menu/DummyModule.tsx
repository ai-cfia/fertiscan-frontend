import React from 'react';
import { Box, Typography } from '@mui/material';

const DummyModule: React.FC = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">Dummy Module</Typography>
      <Typography variant="body1">This is a dummy module for testing purposes.</Typography>
    </Box>
  );
};

export default DummyModule;
