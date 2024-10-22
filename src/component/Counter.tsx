// src/components/Counter.tsx
import useStore from "@/store/useStore";
import { Button, Typography } from "@mui/material";
import React from "react";

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
