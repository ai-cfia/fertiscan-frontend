import React from 'react';

//Main component
const localConstant: React.FC = () => {
    // Define a local constant
    const localConst: string = "Hello, World!";

    return (
        <div>
            <h1>{localConst}</h1>
        </div>
    );
};

export default localConstant;