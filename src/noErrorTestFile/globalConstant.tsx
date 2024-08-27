import React from 'react';

// Define a global constant
const GREETING_MESSAGE = "Hello, World!";

const globalConstant: React.FC = () => {
    return (
        <div>
            <h1>{GREETING_MESSAGE}</h1>
        </div>
    );
};

export default globalConstant;