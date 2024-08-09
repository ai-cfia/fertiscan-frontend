// src/CustomHookAndHandlerOrder.ts  
  
import React, { useState } from 'react';  
  
const useCustomHook = () => {  
  return useState(0);  
};  
  
const CustomHookAndHandlerOrder = () => {  
  const handleClick = () => {  
    console.log('Clicked');  
  };  
  
  const [count, setCount] = useCustomHook(); // Error: Custom hooks should be before handlers  
  
  return <button onClick={handleClick}>Count: {count}</button>;  
};  
  
export default CustomHookAndHandlerOrder;  
