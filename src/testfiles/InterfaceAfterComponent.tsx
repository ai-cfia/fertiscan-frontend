// src/InterfaceAfterComponent.ts  
  
import React from 'react';  
  
const InterfaceAfterComponent = () => {  
  const value: MyInterface = { name: "Test" };  
  return <div>{value.name}</div>;  
};  
  
interface MyInterface {  
  name: string;  
} // Error: Interfaces should be declared before components  
  
export default InterfaceAfterComponent;  
