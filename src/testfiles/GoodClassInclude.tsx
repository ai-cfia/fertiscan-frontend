// ExampleFile.tsx  
  
import React, { useState, useEffect, useContext, createContext, FunctionComponent } from 'react';  
import styled from 'styled-components';  
  
// Global Constants  
const GLOBAL_CONSTANT = 'This is a global constant';  
  
// Interfaces  
interface ExampleProps {  
  name: string;  
  age: number;  
}  
  
// Type Aliases  
type ExampleType = {  
  description: string;  
}  
  
// Enums  
enum ExampleEnum {  
  FIRST,  
  SECOND,  
  THIRD  
}  
  
// Context  
const ExampleContext = createContext(null);  
  
// Styled Component  
const StyledButton = styled.button`  
  background-color: blue;  
  color: white;  
`;  
  
// Custom Hook  
const useExampleHook = () => {  
  const [value, setValue] = useState(0);  
    
  useEffect(() => {  
    // effect logic  
  }, []);  
  
  return { value, setValue };  
};  
  
// Helper Function  
function helperFunction() {  
  console.log('This is a helper function');  
}  
  
// React Functional Component  
const FunctionalComponent: FunctionComponent<ExampleProps> = ({ name, age }) => {  
  const { value, setValue } = useExampleHook();  
  
  const handleClick = () => {  
    setValue(value + 1);  
  };  
  
  return (  
    <div>  
      <StyledButton onClick={handleClick}>  
        {name} is {age} years old. Clicked {value} times.  
      </StyledButton>  
    </div>  
  );  
};  
  
// React Class Component  
class GoodClassInclude extends React.Component<ExampleProps> {  
  state = {  
    count: 0,  
  };  
  
  constructor(props) {  
    super(props);  
    this.state = {  
      count: 0,  
    };  
  }  
  
  componentDidMount() {  
    console.log('Component mounted');  
  }  
  
  handleButtonClick = () => {  
    this.setState({ count: this.state.count + 1 });  
  };  
  
  render() {  
    return (  
      <div>  
        <StyledButton onClick={this.handleButtonClick}>  
          {this.props.name} clicked {this.state.count} times.  
        </StyledButton>  
      </div>  
    );  
  }  
}  
  
// Export Statements  
export { FunctionalComponent, GoodClassInclude, ExampleContext, ExampleEnum, ExampleType, ExampleProps };  
export default GoodClassInclude;  
