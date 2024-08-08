import { useContext } from 'react';
import * as React from 'react';

const DisorganizedComponent2 = (props: any) => {
  const { name } = useContext(MyContext); // Undefined context due to order (Error) (Not working)

  // Using hooks after early return (Error)
  if (!name) {
    return <div>No name provided!</div>;
  }

  const [product, setProduct] = React.useState(null);

  // Effects (Work but the error message should not said : Error in src/testfiles/DisorganizedComponent2.tsx :14:2 - Constante declarations should come before global constants, React component declarations.)
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

  // Inline styles in the middle of the component (Error) (detecting the error but the message is not correct: Error in src/testfiles/DisorganizedComponent2.tsx :34:2 - Constante declarations should come before global constants, helper functions, React component declarations.)
  const styles = {
    header: {
      textAlign: 'center', //Why this is generating an error : Error in src/testfiles/DisorganizedComponent2.tsx :37:2 - Constante declarations should come before global constants, helper functions, React component declarations.
    },
  };

  // Components should have been defined above (Error)
  return (
    <div style={styles.header}>
      <h1>{`Hello ${name}`}</h1>
    </div>
  );
};

// Incorrectly placing styled components in the middle of the code (Error)
const MyContext = React.createContext(null); // detecting well but my code thing this is an constante and it is not : Error in src/testfiles/DisorganizedComponent2.tsx :52:0 - Global constant declarations should come before global constants, helper functions, React component declarations.
export default DisorganizedComponent2;