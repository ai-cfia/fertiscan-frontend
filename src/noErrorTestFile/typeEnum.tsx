import React from 'react';

// Define an enum
enum Greeting {
    HELLO = "Hello",
    HI = "Hi",
    GOOD_MORNING = "Good Morning"
}

const typeEnum: React.FC = () => {
    // Use the enum
    const greetingMessage = Greeting.HELLO + ", World!";

    return (
        <div>
            <h1>{greetingMessage}</h1>
        </div>
    );
};

export default HelloWorld;