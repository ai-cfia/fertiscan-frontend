import React, { createContext, useState } from 'react';
import SettingPage from "./Pages/SettingPage/SettingPage";

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

const ThemeProvider = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <SettingPage />
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
