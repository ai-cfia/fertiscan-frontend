import i18next from "i18next";
import { StrictMode, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./Components/Header/Header";
import SideMenu from "./Components/SideMenu/SideMenu";
import HomePage from "./Pages/HomePage/HomePage";
import NoPage from "./Pages/NoPage/NoPage";
import SettingPage from "./Pages/SettingPage/SettingPage";
import SavedListPage from "./Pages/SavedListPage/SavedListPage";
import { AlertProvider } from "./Utils/AlertContext";
import { SessionProvider } from "./Utils/SessionContext";
import LabelPage from "./Pages/LabelPage/LabelPage";

function App() {
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    i18next.changeLanguage(storedLanguage || "en");
  }, []);

  return (
    <AlertProvider>
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
              <Route path="Saved" element={<SavedListPage />} />
              <Route path="Label/:labelId" element={<LabelPage />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SessionProvider>
    </AlertProvider>
  );
}

export default App;
