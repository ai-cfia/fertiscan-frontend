import React from 'react';

// Define a helper function
const getGreetingMessage = (): string => {
    return "Hello, World!";
};

const helperFunction: React.FC = () => {
    // Use the helper function
    const greetingMessage: string = getGreetingMessage();

    return (
        <div>
            <h1>{greetingMessage}</h1>
        </div>
    );
};

export default helperFunction;