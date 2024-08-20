import React from 'react';

// Define a global constant
const GREETING_MESSAGE: string = "Hello, World!";

const globalContant: React.FC = () => {
    return (
        <div>
            <h1>{GREETING_MESSAGE}</h1>
        </div>
    );
};

export default globalContant;