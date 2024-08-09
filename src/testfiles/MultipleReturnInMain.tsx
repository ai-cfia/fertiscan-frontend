// src/MultipleReturns.tsx  
  
import React from 'react';  
  
const MultipleReturnInMain = () => {  
  if (true) {  
    return <div>First Return</div>;  
  }  
  return <div>Second Return</div>; // Error: Multiple return statements  
    
};  
  
export default MultipleReturnInMain;  
