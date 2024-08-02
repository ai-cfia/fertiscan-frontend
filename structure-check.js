// 1. Imports
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { SomeContext } from './SomeContext';
import SomeUtilityFunction from './SomeUtilityFunction';
import ChildComponent from './ChildComponent';
import { ReactComponent as SomeIcon } from './some-icon.svg';
import './MyComponent.css';

// 2. Constants
const GLOBAL_CONSTANT = 'GLOBAL_VALUE';

// 3. Helper Functions (Optional)
function calculateSomething(value) {
  // Pure function to calculate something
  return value * 2;
}

// 4. Custom Hooks (Optional)
function useCustomHook() {
  const context = useContext(SomeContext);
  // Custom hook logic
  // ...

  return context.value;
}

// 5. Main Component
function MyComponent({ propValue }) {
  // Component constants
  const LOCAL_CONSTANT = 'LOCAL_VALUE';

  // State hooks
  const [count, setCount] = useState(0);

  // Context hooks
  const someContextValue = useContext(SomeContext);

  // Effect hooks
  useEffect(() => {
    // Side-effects
    document.title = `You clicked ${count} times`;
    return () => {
      // Cleanup
      document.title = 'React App';
    };
  }, [count]); // Only re-run the effect if count changes

  // Handler functions
  function handleClick() {
    setCount(count + 1);
    SomeUtilityFunction();
  }

  // Render logic
  const renderConditionally = count > 5 ? <div>Count is high!</div> : <div>Count is low!</div>;

  // Component return
  return (
    <div className="my-component">
      <h1>{GLOBAL_CONSTANT}</h1>
      <SomeIcon aria-label="Icon" />
      {renderConditionally}
      <button onClick={handleClick}>Increment Count</button>
      <ChildComponent value={someContextValue}/>
    </div>
  );
}

// 6. PropTypes / DefaultProps
MyComponent.propTypes = {
  propValue: PropTypes.string.isRequired,
};

MyComponent.defaultProps = {
  propValue: 'Default Value',
};

// 7. Styled Components (if using styled-components or a similar library)
// const StyledDiv = styled.div` ... `;

// 8. Export
export default MyComponent;
