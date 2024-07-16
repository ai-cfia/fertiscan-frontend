import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import NoPage from "./Pages/NoPage/NoPage";
import "./App.css";
import Header from "./Components/Header/Header";
import { StrictMode, useEffect } from "react";
import SideMenu from "./Components/SideMenu/SideMenu";
import SettingPage from "./Pages/SettingPage/SettingPage";
import i18next from "i18next";
import { SessionProvider } from "./Utils/SessionContext";
import { ErrorProvider } from "./Utils/ErrorContext";

function App() {
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    i18next.changeLanguage(storedLanguage || "en");
  }, []);

  return (
    <ErrorProvider>
      <SessionProvider>
        <BrowserRouter>
          <StrictMode>
            <Header />
            <SideMenu />
          </StrictMode>
          <Routes>
            <Route path="/">
              <Route index element={<HomePage />} />
              <Route path="Settings" element={<SettingPage />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SessionProvider>
    </ErrorProvider>
  );
}

export default App;
