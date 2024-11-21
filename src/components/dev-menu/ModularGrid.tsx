import React, { useState } from 'react';
import { Box, Button, Typography, Select, MenuItem, FormControl, InputLabel, Card, CardContent } from '@mui/material';
import Logs from './Logs';
import DummyModule from './DummyModule';
import ButtonStackModule from './ButtonStackModule';

// Define the type for the MODULES object
const MODULES: { [key: string]: React.FC } = {
  logs: Logs,
  dummy1: DummyModule,
  dummy2: DummyModule,
  dummy3: DummyModule,
  dummy4: DummyModule,
  dummy5: DummyModule,
  buttonStack: ButtonStackModule
};

const ModularGrid: React.FC = () => {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  const handleModuleSelect = (module: string) => {
    if (!selectedModules.includes(module)) {
      setSelectedModules([...selectedModules, module]);
    }
  };

  const handleModuleDeselect = (module: string) => {
    setSelectedModules(selectedModules.filter((mod) => mod !== module));
  };

  return (
    <Box sx={{ p: 2, height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
      <Typography variant="h6" gutterBottom>
        Modular Grid
      </Typography>
      <FormControl variant="outlined" sx={{ minWidth: 200, mb: 2 }}>
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
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 2,
          flexGrow: 1,
          overflowY: 'auto',
          p: 1,
          borderRadius: 2,
          border: '1px solid #ddd',
          bgcolor: 'background.paper',
        }}
      >
        {selectedModules.map((module) => {
          const ModuleComponent = MODULES[module];
          return (
            <Card
              key={module}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 'fit-content',
                boxShadow: 3,
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid #ddd',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{module.charAt(0).toUpperCase() + module.slice(1)}</Typography>
                  <Button size="small" color="secondary" onClick={() => handleModuleDeselect(module)}>
                    Remove
                  </Button>
                </Box>
                <ModuleComponent />
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default ModularGrid;
