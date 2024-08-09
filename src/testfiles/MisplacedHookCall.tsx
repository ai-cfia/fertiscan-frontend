// src/MisplacedHookCall.ts  
  
import React from 'react';  
  
const MisplacedHookCall = () => {  
  if (true) {  
    const [state, setState] = React.useState(0); // Error: Hooks should not be inside conditionals  
  }  
  
  return <div>Hello</div>;  
};  
  
export default MisplacedHookCall;  
