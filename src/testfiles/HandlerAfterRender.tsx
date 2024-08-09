// src/HandlersAfterRender.tsx  
  
import React from 'react';  
  
const HandlerAfterRender = () => {  
  return <button onClick={handleClick}>Click me</button>;  
  
  const handleClick = () => {  
    console.log('Clicked');  
  }; // Error: Handlers should be defined before render logic  
};  
  
export default HandlerAfterRender;  
