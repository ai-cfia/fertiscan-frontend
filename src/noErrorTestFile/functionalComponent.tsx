import React from 'react';

const test: React.FC = () => {
    return (
        <div>
            <h1>test</h1>
        </div>
    );
};

const functionalComponent: React.FC = () => {
    // Define a local constant
    const GREETING_MESSAGE: string = "Hello, World!";

    return (
        <div>
            <h1>{GREETING_MESSAGE}</h1>
        </div>
    );
};

export default functionalComponent;