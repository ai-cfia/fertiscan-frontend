import React, { useState } from 'react';
import { Box, Button, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import Logs from './Logs';
import DummyModule from './DummyModule';
import GridLayout, { WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(GridLayout);

// Define available modules
const MODULES: { [key: string]: React.FC } = {
  logs: Logs,
  dummy1: DummyModule,
  dummy2: DummyModule,
  dummy3: DummyModule,
  dummy4: DummyModule,
  dummy5: DummyModule,
};

// Component
const ModularGrid: React.FC = () => {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const isLargeScreen = useMediaQuery('(min-width:600px)');

  // Handler for selecting modules
  const handleModuleSelect = (module: string) => {
    setSelectedModules((prev) => (prev.includes(module) ? prev : [...prev, module]));
  };

  // Handler for deselecting modules
  const handleModuleDeselect = (module: string) => {
    setSelectedModules((prev) => prev.filter((mod) => mod !== module));
  };

  // Generating initial layout
  const initialLayout: Layout[] = selectedModules.map((module, index) => ({
    i: module,
    x: (index % 2) * 6,
    y: Math.floor(index / 2) * 6,
    w: 6,
    h: 6, // Adjust height as necessary
  }));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h6">Modular Grid</Typography>
        <Button variant="contained" onClick={() => setIsEditable((prev) => !prev)}>
          {isEditable ? 'Disable Edit' : 'Enable Edit'}
        </Button>
      </Box>
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
      <ResponsiveGridLayout
        className="layout"
        layout={initialLayout}
        cols={12}
        rowHeight={30}
        width={isLargeScreen ? 1200 : 600}
        margin={[15, 15]}
        containerPadding={[15, 15]}
        isDraggable={isEditable} // Draggable only when edit mode is enabled
        isResizable={isEditable} // Resizable only when edit mode is enabled
      >
        {selectedModules.map((module) => {
          const ModuleComponent = MODULES[module];
          return (
            <Box
              key={module}
              data-grid={{ i: module, x: (module === 'logs' ? 0 : 6), y: 0, w: 6, h: 6 }} // Ensure the data-grid attributes match the initialLayout
              sx={{
                border: '1px solid grey',
                padding: 2,
                borderRadius: 2,
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{module.charAt(0).toUpperCase() + module.slice(1)}</Typography>
                <Button color="secondary" onClick={() => handleModuleDeselect(module)}>Remove</Button>
              </Box>
              <Box sx={{ flexGrow: 1, marginTop: 1 }}>
                <ModuleComponent />
              </Box>
            </Box>
          );
        })}
      </ResponsiveGridLayout>
    </Box>
  );
};

export default ModularGrid;
