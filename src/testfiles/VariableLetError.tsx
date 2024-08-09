// src/LetInsteadOfConst.ts  
  
import React from 'react';  
  
const VariableLetError = () => {  
  let notReassigned = "This should be const"; // Error: Should use const  
  
  return <div>{notReassigned}</div>;  
};  
  
export default VariableLetError;  
