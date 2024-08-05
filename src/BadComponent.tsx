import React, { useState, useEffect } from 'react';

const BadComponent: React.FC = () => {
  const renderConditionally = () => {
    if (count > 5) return <div>Count is high!</div>;
    return <div>Count is low...</div>;
  };

  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count => count + 1);
  };

  useBadHook(); // Custom hooks should be used at the top of the component.

  return (
    <div>
      <h1>Incorrect Component Structure</h1>
      {renderConditionally()}
      <button onClick={handleIncrement}>Increment</button>
      <p>Count: {count}</p>
    </div>
  );
};

export const useBadHook = () => {
  useEffect(() => {
    console.log('This is a bad side effect placement.');
  }, []);
};

type Props = {
  message: string; // Types should be declared at the top of the file.
};

export default BadComponent;