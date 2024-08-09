// src/LocalConstantsError.ts  
  
import React from 'react';  
  
const LocalConstError = () => {  
  const handleClick = () => {};  
  const value = "Should be declared before handlers";  
  
  return <button onClick={handleClick}>Click me</button>;  
};  
  
export default LocalConstError;  
