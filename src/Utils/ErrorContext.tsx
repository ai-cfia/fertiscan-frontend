import { createContext, useState, useContext, SetStateAction } from 'react';

export interface ErrorContextType {
  message: string;
  showAlert: (msg: string) => void;
  clearAlert: () => void;
}

export const ErrorContext = createContext<ErrorContextType>({
  message: '',
  showAlert: (_msg: string) => {},
  clearAlert: () => {}
});

export const Error = () => useContext(ErrorContext);

export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState('');

  const showAlert = (msg: SetStateAction<string>) => {
    console.log("msg");
    setMessage(msg);
  };

  const clearAlert = () => {
    setMessage('');
  };

  return (
    <ErrorContext.Provider value={{ message, showAlert, clearAlert }}>
      {children}
    </ErrorContext.Provider>
  );
};