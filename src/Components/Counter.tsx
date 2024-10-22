// src/components/Counter.tsx
import React from 'react';
import { Button, Typography } from '@mui/material';
import useStore from '@/store/useStore';

const Counter: React.FC = () => {
  const { counter, increment } = useStore();

  return (
    <div>
      <Typography variant="h5">Counter: {counter}</Typography>
      <Button variant="contained" color="primary" onClick={increment}>
        Increment
      </Button>
    </div>
  );
};

export default Counter;
