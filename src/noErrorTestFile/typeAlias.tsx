import React from 'react';

// Define a local type alias
type GreetingMessage = string;

const typeAlias: React.FC = () => {
    // Use the type alias for the constant
    const greeting: GreetingMessage = "Hello, World!";

    return (
        <div>
            <h1>{greeting}</h1>
        </div>
    );
};

export default typeAlias;