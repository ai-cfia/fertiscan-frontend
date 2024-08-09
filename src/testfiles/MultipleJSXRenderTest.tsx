// src/MultipleJSXRenderTest.tsx  
  
import React, { useState, useEffect, useCallback, useContext } from 'react';  
import styled from 'styled-components';  
import AnotherComponent from './AnotherComponent';  
  
const MyContext = React.createContext(null);  
  
interface MyProps {  
  title: string;  
  description?: string;  
}  
  
type MyType = {  
  name: string;  
  age: number;  
}  
  
enum MyEnum {  
  A = 'A',  
  B = 'B'  
}  
  
// Global constant  
const GLOBAL_CONST = 'This is a global constant';  
  
const MultipleJSXRenderTest: React.FC<MyProps> = ({ title, description }) => {  
  // Local constants  
  const [state, setState] = useState<MyType | null>(null);  
  const [show, setShow] = useState(true);  
  const [items, setItems] = useState<string[]>(['Item 1', 'Item 2', 'Item 3']);  
  const context = useContext(MyContext);  
  
  // Custom hook usage  
  const memoizedCallback = useCallback(() => {  
    // Do something  
  }, []);  
  
  // Another custom hook  
  useEffect(() => {  
    if (state) {  
      // Do something with state  
    }  
  }, [state]);  
  
  // Handler function  
  const handleClick = () => {  
    setState({ name: 'John Doe', age: 30 });  
  };  
  
  // Conditional rendering using ternary operator  
  const renderTernary = () => (  
    show ? <p>Show is true</p> : <p>Show is false</p>  
  );  
  
  // Logical && operator for conditional rendering  
  const renderLogicalAnd = () => (  
    show && <p>This is conditionally rendered using && operator</p>  
  );  
  
  // JSX elements from an array  
  const renderList = () => (  
    items.map((item, index) => <li key={index}>{item}</li>)  
  );  
  
  // Fragment syntax  
  const renderFragments = () => (  
    <>  
      <h2>Fragment Header</h2>  
      <p>This is a fragment content</p>  
    </>  
  );  
  
  // IIFE returning JSX  
  const renderIIFE = (() => {  
    return <p>This is returned from an IIFE</p>;  
  })();  
  
  return (  
    <Wrapper>  
      <h1>{title}</h1>  
      {description ? <p>{description}</p> : null}  
      {renderTernary()}  
      {renderLogicalAnd()}  
      <ul>{renderList()}</ul>  
      {renderFragments()}  
      {renderIIFE}  
      <AnotherComponent />  
      <button onClick={handleClick}>Click me</button>  
    </Wrapper>  
  );  
};  
  
// Helper function  
function helperFunction() {  
  console.log('This is a helper function');  
}  
  
// Custom hook  
function useCustomHook() {  
  const [customState, setCustomState] = useState(0);  
  useEffect(() => {  
    setCustomState(1);  
  }, []);  
  return customState;  
}  
  
// Styled Component  
const Wrapper = styled.div`  
  padding: 20px;  
  background-color: #f0f0f0;  
`;  
  
// Class Component  
class ClassComponent extends React.Component<MyProps> {  
  state = { count: 0 };  
  
  componentDidMount() {  
    // Lifecycle method  
    console.log('Component mounted');  
  }  
  
  handleIncrement = () => {  
    this.setState((prevState) => ({ count: prevState.count + 1 }));  
  };  
  
  render() {  
    return (  
      <div>  
        <h2>{this.props.title}</h2>  
        <p>Count: {this.state.count}</p>  
        <button onClick={this.handleIncrement}>Increment</button>  
      </div>  
    );  
  }  
}  
  
export default MultipleJSXRenderTest;  
export { ClassComponent, MyContext, GLOBAL_CONST, MyEnum };  
