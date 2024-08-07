import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const testErreur = "test";

type UseCounterHook = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: (value?: number) => void;
}

function useCounter(initialValue: number = 0): UseCounterHook {
  const [count, setCount] = useState<number>(initialValue);

  const increment = () => {
      setCount((prevCount) => prevCount + 1);
  };

  const decrement = () => {
      setCount((prevCount) => prevCount - 1);
  };

  const reset = (value: number = initialValue) => {
      setCount(value);
  };

  // Return the state and the functions to mutate it
  return { count, increment, decrement, reset };
}

enum Color {
  Red = 'red',
  Green = 'green',
  Blue = 'blue',
}


//main component
function App() {
  
  const [count, setCount] = useState(0)
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
