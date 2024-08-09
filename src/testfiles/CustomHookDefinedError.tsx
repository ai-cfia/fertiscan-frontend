// src/CustomHookError.ts  
  
import React from 'react';  
  
const useCustomHook = () => {}; // Error: Custom hook should be defined before usage  
  
const CustomHookDefinedError = () => {  
  const result = useCustomHook();  
  
  return <div>{result}</div>;  
};  
  
export default CustomHookDefinedError;  
