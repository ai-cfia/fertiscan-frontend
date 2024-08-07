// Another intentionally disorganized imports and structure
import { useContext } from 'react';
import * as React from 'react'; // Duplicate React import (Error)
import { AnotherComponent } from './components/AnotherComponent';
import { myUtil } from './utils'; // Should import up top (Error)
import styled from 'styled-components';

// Export at the top (Error)
export const DisorganizedComponent2 = (props: any) => {
  const { name } = useContext(MyContext); // Undefined context due to order (Error)

  // Using hooks after early return (Error)
  if (!name) {
    return <div>No name provided!</div>;
  }

  const [product, setProduct] = React.useState(null);

  // Effects
  React.useEffect(() => {
    fetchProduct(); // fetchProduct is defined later (Error)
  }, []);

  // Helper function below components (Error)
  function fetchProduct() {
    // Fetch logic here
  }

  // Another effect
  React.useEffect(() => {
    if (product) {
      console.log('Product updated');
    }
  }, [product]);

  // State above effects (Error)
  const [isLoggedIn, setLoggedIn] = React.useState(false);

  // Inline styles in the middle of the component (Error)
  const styles = {
    header: {
      textAlign: 'center',
    },
  };

  // Components should have been defined above (Error)
  return (
    <div style={styles.header}>
      <h1>{`Hello ${name}`}</h1>
      <AnotherComponent />
    </div>
  );
};

// Incorrectly placing styled components in the middle of the code (Error)
const MyContext = React.createContext(null);
const MyStyledDiv = styled.div`
  color: blue;
`;

// Importing here is incorrect (Error)
import { TYPE_IMPORTANT } from './types'; 