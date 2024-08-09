// src/StyledComponentsError.ts  
  
import styled from 'styled-components';  
import React from 'react';  
  
const StyleCompNotWellDefined = () => {  
  return <StyledDiv>Hello</StyledDiv>;  
};  
  
const StyledDiv = styled.div`  
  color: blue;  
`; // Error: Styled component should be declared before usage  
  
export default StyleCompNotWellDefined;  
