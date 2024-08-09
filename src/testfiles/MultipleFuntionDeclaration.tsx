import React, { useState, useEffect, useContext, createContext, FunctionComponent } from 'react';  
import styled from 'styled-components';  
  
// Global Constants  
export const GLOBAL_CONSTANT = 'Some value';  
  
// Types  
interface Props {  
  title: string;  
}  
  
type StateType = {  
  count: number;  
}  
  
enum UserRole {  
  Admin,  
  User,  
}  
  
// Context  
const MyContext = createContext('defaultValue');  
  
// Custom Hook  
function useCustomHook() {  
  const [value, setValue] = useState<string>('Initial value');  
  
  useEffect(() => {  
    console.log('Custom hook used');  
  }, []);  
  
  return [value, setValue] as const;  
}  
  
// Helper Function  
function helperFunction() {  
  console.log('This is a helper function');  
}  
  
// Named Function Expression  
const namedFunctionExpression = function namedFunc() {  
  console.log('This is a named function expression');  
};  
  
// Anonymous Function Expression  
const anonymousFunctionExpression = function() {  
  console.log('This is an anonymous function expression');  
};  
  
// Arrow Function  
const arrowFunction = () => {  
  console.log('This is an arrow function');  
};  
  
// Immediately Invoked Function Expression (IIFE)  
(function iifeFunction() {  
  console.log('This is an immediately invoked function expression');  
})();  
  
// Generator Function  
function* generatorFunction() {  
  yield 'This is a generator function';  
}  
  
// Async Function  
async function asyncFunction() {  
  console.log('This is an async function');  
}  
  
const MultipleFuntionDeclaration: FunctionComponent<Props> = ({ title }) => {  
  // Local Constants  
  const LOCAL_CONSTANT = 'Local value';  
    
  // Hooks  
  const [count, setCount] = useState<number>(0);  
  const contextValue = useContext(MyContext);  
  const [customValue, setCustomValue] = useCustomHook();  
  
  useEffect(() => {  
    console.log('Component mounted');  
  }, []);  
  
  // Handlers  
  const handleClick = () => {  
    setCount(count + 1);  
  };  
  
  return (  
    <Container>  
      <h1>{title}</h1>  
      <p>Count: {count}</p>  
      <p>Context Value: {contextValue}</p>  
      <p>Custom Hook Value: {customValue}</p>  
      <button onClick={handleClick}>Increment</button>  
    </Container>  
  );  
};  
  
// Styled Component  
const Container = styled.div`  
  padding: 20px;  
  background-color: #f0f0f0;  
`;  
  
// Class Component  
class MyClassComponent extends React.Component {  
  state: StateType = {  
    count: 0,  
  };  
  
  componentDidMount() {  
    console.log('Class component mounted');  
  }  
  
  handleIncrement = () => {  
    this.setState((prevState) => ({  
      count: prevState.count + 1,  
    }));  
  };  
  
  render() {  
    return (  
      <div>  
        <p>Class Component Count: {this.state.count}</p>  
        <button onClick={this.handleIncrement}>Increment</button>  
      </div>  
    );  
  }  
}  
  
export default MultipleFuntionDeclaration;  
export { MyClassComponent, helperFunction, namedFunctionExpression, anonymousFunctionExpression, arrowFunction, generatorFunction, asyncFunction, useCustomHook, MyContext, UserRole };  
