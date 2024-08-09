// src/ImproperJSXStructure.tsx  
  
import React from 'react';  
  
const ImproperJSXStructure = () => {  
  if (true) {  
    return <div>Conditional Render</div>;  
  }  
  <span>Misplaced JSX</span>; // Error: JSX should be returned or part of render logic  
  
  return <div>Hello</div>;  
};  
  
export default ImproperJSXStructure;  
