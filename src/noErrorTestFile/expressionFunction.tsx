import React from 'react';

// Define a global constant
const GREETING_MESSAGE: string = "Hello, World!";

const test: React.FC = () => {
    return (
        <div>
            <h1>{GREETING_MESSAGE}</h1>
        </div>
    );
};

// Define the HelloWorld component as a function expression
const expressionFunction: React.FC = () => {
    return (
        <div>
            <h1>{GREETING_MESSAGE}</h1>
        </div>
    );
};

export default expressionFunction;