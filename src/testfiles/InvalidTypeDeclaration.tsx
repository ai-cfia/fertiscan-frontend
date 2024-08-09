// src/InvalidTypeDeclaration.ts  
  
interface MyInterface {  
    name: string;  
  }  
    
  type MyType = {  
    age: number;  
  };  
    
  enum MyEnum {  
    First,  
    Second,  
  }  
    
  import React from 'react';  
    
  const InvalidTypeDeclaration = () => {  
    const age: MyType = { age: 30 };  
    return <div>{age.age}</div>;  
  };  
    
  export default InvalidTypeDeclaration;  
  