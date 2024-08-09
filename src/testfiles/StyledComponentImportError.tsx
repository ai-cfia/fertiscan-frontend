// src/StyledComponentImportError.ts  
  
import React from 'react';  
  
const StyledComponentImportError = () => {  
  return <StyledDiv>Hello</StyledDiv>;  
};  
  
import styled from 'styled-components';  
  
const StyledDiv = styled.div`  
  color: blue;  
`; // Error: Styled component should be declared before usage  
  
export default StyledComponentImportError;  
