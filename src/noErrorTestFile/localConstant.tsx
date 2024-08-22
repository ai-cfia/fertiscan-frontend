import React from 'react';

//Main component
const localConstant: React.FC = () => {
    // Define a local constant
    const GREETING_MESSAGE: string = "Hello, World!";

    return (
        <div>
            <h1>{GREETING_MESSAGE}</h1>
        </div>
    );
};

export default localConstant;