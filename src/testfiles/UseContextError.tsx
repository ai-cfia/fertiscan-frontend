// src/file2.ts  
  
import React, { createContext, useContext } from 'react';  
  
const MyContext = createContext(null);  
  
const UseContextError = () => {  
  const contextValue = useContext(MyContext); // Correct usage of useContext  
    
  return <div>{contextValue}</div>;  
};  
  
export default UseContextError;  
