// src/IncorrectExport.ts  
  
import React from 'react';  
  
const ExportedDontMatchMain = () => {  
  return <div>Main Component</div>;  
};  
  
const AnotherComponent = () => {  
  return <div>Another Component</div>;  
};  
  
export default AnotherComponent; // Error: Should export MainComponent  
