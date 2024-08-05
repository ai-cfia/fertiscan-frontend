import React, { useState, useEffect } from 'react';

type Props = {
  message: string;
};



const testErreur = "test";

//main component
const GoodComponent: React.FC<Props> = ({ message }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Side effect...
  }, []);



  const handleIncrement = () => {
    setCount(count => count + 1);
  };



  return (
    <div>
      <h1>{message}</h1>
      <button onClick={handleIncrement}>Increment</button>
      <p>Count: {count}</p>
    </div>
  );
};
const useCustomHook = () => {
  const [hookState, setHookState] = useState(null);
  // Custom hook logic...
  return hookState;
};

export default GoodComponent;