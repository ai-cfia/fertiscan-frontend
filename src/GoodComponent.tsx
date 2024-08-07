import React, { useState, useEffect } from 'react';

const testErreur = "test";

type Props = {
  message: string;
};

const useCustomHook = () => {
  const [hookState, setHookState] = useState(null);
  // Custom hook logic...
  return hookState;
};

//main component
const GoodComponent: React.FC<Props> = ({ message }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Side effect...
  }, []);



  const handleIncrement = () => {
    setCount(count => count + 1);
  };


  const [count1, setCount1] = useState(0);

  return (
    <div>
      <h1>{message}</h1>
      <button onClick={handleIncrement}>Increment</button>
      <p>Count: {count}</p>
    </div>
  );
};


export default GoodComponent;