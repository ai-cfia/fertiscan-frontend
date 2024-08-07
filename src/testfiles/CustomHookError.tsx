import React, { useState } from 'react';

// Main React component defined first (this should come after the custom hook according to script logic)
function MyComponent() {
  // ...
  return <div>Hello World</div>;
}

// Custom hook usage which should generate an error because it is not at the top of the file
function useCustomHook() {
  const [state, setState] = useState(null);
  // Hook logic...
  return state;
}