import React, { useState } from 'react';
import { Box, Button, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import Logs from './Logs';
import DummyModule from './DummyModule';

const MODULES: { [key: string]: React.FC } = {
  logs: Logs,
  dummy1: DummyModule,
  dummy2: DummyModule,
  dummy3: DummyModule,
  dummy4: DummyModule,
  dummy5: DummyModule,




  // other modules can be added here
};

const ModularGrid: React.FC = () => {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const isLargeScreen = useMediaQuery('(min-width:600px)');

  const handleModuleSelect = (module: string) => {
    setSelectedModules((prev) => (prev.includes(module) ? prev : [...prev, module]));
  };

  const handleModuleDeselect = (module: string) => {
    setSelectedModules((prev) => prev.filter((mod) => mod !== module));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
      <Typography variant="h6">Modular Grid</Typography>
      <FormControl variant="outlined" sx={{ minWidth: 200, marginBottom: 2 }}>
        <InputLabel>Select Module</InputLabel>
        <Select
          label="Select Module"
          value=""
          onChange={(e) => handleModuleSelect(e.target.value as string)}
        >
          {Object.keys(MODULES).map((module) => (
            <MenuItem key={module} value={module}>
              {module.charAt(0).toUpperCase() + module.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ display: 'grid', gridTemplateColumns: isLargeScreen ? '1fr 1fr' : '1fr', gap: 2 }}>
        {selectedModules.map((module) => {
          const ModuleComponent = MODULES[module] as React.FC;
          return (
            <Box key={module} sx={{ border: '1px solid grey', padding: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{module.charAt(0).toUpperCase() + module.slice(1)}</Typography>
                <Button color="secondary" onClick={() => handleModuleDeselect(module)}>Remove</Button>
              </Box>
              <ModuleComponent />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ModularGrid;
