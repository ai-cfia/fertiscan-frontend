// Intentionally disorganized imports and structure
import React, { useState, useEffect } from 'react';
import { someUtilityFunction } from './utils';
import logo from './logo.svg';
import './App.css';

// Constants
const MESSAGE = 'Welcome to React';

function DisorganizedComponent1(props: any) {
  // Component constants
  const localConstant = 'Local to component';
  
  // State hooks
  const [count, setCount] = useState(0);

  // Event handlers
  const handleClick = () => {
    console.log('Button clicked');
  };
  
  // Context hooks before state hooks (Error)
  const contextValue = React.useContext(myContext);

  // Custom Hooks
  // This should be before state and effect hooks (Error)
  function useCustomHook() {
    useEffect(() => {
      document.title = `You clicked ${count} times`;
    });
  }

  // Side-effects not enclosed in hooks (Error)
  document.title = `React App: ${count}`;
  
  // Missing other structure elements and improper order

  // Render logic
  const renderButton = () => {
    if (count > 0) {
      return <Button onClick={handleClick}>Click me</Button>;
    } else {
      // Importing assets in the middle of the component (Error)
      import('./App.css');
      return <div>No count yet</div>;
    }
  };

  // Return statement above helper functions (Error)
  return (
    <div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{MESSAGE}</p>
        {renderButton()}
        <div>{contextValue.someValue}</div>
      </header>
    </div>
  );
}

// Styled components not sectioned (Error)
const StyledFooter = styled.footer`
  text-align: center;
`;

// Export
export default DisorganizedComponent1;