import React from 'react';

// Define a global constant
const GREETING_MESSAGE: string = "Hello, World!";

const useTestHook = () => {
    return (
        <div>
            <h1>{GREETING_MESSAGE}</h1>
        </div>
    );
};

const handleTestHook = () => {
    return (
        <div>
            <h1>{GREETING_MESSAGE}</h1>
        </div>
    );
};

// Define the HelloWorld component as an arrow function
const arrowFunction: React.FC = () => (
    <div>
        <h1>{GREETING_MESSAGE}</h1>
    </div>
);

export default arrowFunction;