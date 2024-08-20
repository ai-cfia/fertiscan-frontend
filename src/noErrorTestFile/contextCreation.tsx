import React, { createContext, useContext, ReactNode } from 'react';

// Define the shape of the context value
interface GreetingContextType {
    greeting: string;
}

// Create a context with a default value
const GreetingContext = createContext<GreetingContextType | undefined>(undefined);

// Create a provider component
const contextCreation: React.FC<{children: ReactNode}> = ({ children }) => {
    const greeting = "Hello, World!";

    return (
        <GreetingContext.Provider value={{ greeting }}>
            {children}
        </GreetingContext.Provider>
    );
};

// Custom hook to use the GreetingContext
const useGreeting = (): GreetingContextType => {
    const context = useContext(GreetingContext);
    if (context === undefined) {
        throw new Error("useGreeting must be used within a GreetingProvider");
    }
    return context;
};

export { contextCreation, useGreeting };