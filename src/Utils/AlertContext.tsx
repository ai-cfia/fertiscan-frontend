import React, { createContext, useState, useContext, ReactNode } from "react";

// Types for an alert
type AlertType = "confirm" | "error";

// Shape of the AlertContext
interface AlertContextType {
  message: string;
  type: AlertType | null;
  showAlert: (msg: string, type: AlertType) => void;
  clearAlert: () => void;
}

// Context with default values and a type assertion to avoid TypeScript errors
export const AlertContext = createContext<AlertContextType>({
  message: "",
  type: null,
  // @ts-expect-error : need to be implemented
  // eslint-disable-next-line
  showAlert: (msg: string, type: AlertType) => {},
  clearAlert: () => {},
} as AlertContextType);

// Custom hook to easily use the alert context
export const useAlert = () => useContext(AlertContext);

// Define the props for AlertProvider component
interface AlertProviderProps {
  children: ReactNode;
}

// Provider component that manages the alert state and provides the context to children
export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alert, setAlert] = useState<{
    message: string;
    type: AlertType | null;
  }>({
    message: "",
    type: null,
  });

  const showAlert = (msg: string, type: AlertType) => {
    setAlert({ message: msg, type: type });
  };

  const clearAlert = () => {
    setAlert({ message: "", type: null });
  };

  return (
    <AlertContext.Provider
      value={{
        message: alert.message,
        type: alert.type,
        showAlert,
        clearAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};
