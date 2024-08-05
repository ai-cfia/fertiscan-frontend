import React, { useState, useEffect } from 'react';

type Props = {
  message: string;
};

const useCustomHook = () => {
  const [hookState, setHookState] = useState(null);
  // Custom hook logic...
  return hookState;
};

const testErreur = "test";

//main component
const GoodComponent: React.FC<Props> = ({ message }) => {
  const hookState = useCustomHook();
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Side effect...
  }, []);

  const handleIncrement = () => {
    setCount(count => count + 1);
  };

  const renderConditionally = () => {
    let return_statement: JSX.Element = <></>;
    if (!hookState) return_statement = <div>Loading...</div>;
    else{
      return_statement = <div>{hookState}</div>;
    }
    return return_statement;
  };

  return (
    <div>
      <h1>{message}</h1>
      {renderConditionally()}
      <button onClick={handleIncrement}>Increment</button>
      <p>Count: {count}</p>
    </div>
  );
};

export default GoodComponent;