import i18next from "i18next";
import { StrictMode, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AlertBanner from "./Components/AlertBanner/AlertBanner";
import Header from "./Components/Header/Header";
import SideMenu from "./Components/SideMenu/SideMenu";
import HomePage from "./Pages/HomePage/HomePage";
import LabelPage from "./Pages/LabelPage/LabelPage";
import NoPage from "./Pages/NoPage/NoPage";
import SavedListPage from "./Pages/SavedListPage/SavedListPage";
import SettingPage from "./Pages/SettingPage/SettingPage";
import { AlertProvider } from "./Utils/AlertContext";
import { SessionProvider } from "./Utils/SessionContext";

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
            <AlertBanner />
          </StrictMode>
          <Routes>
            <Route path="/">
              <Route index element={<HomePage />} />
              <Route path="settings" element={<SettingPage />} />
              <Route path="saved" element={<SavedListPage />} />
              <Route path="label/:labelId" element={<LabelPage />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SessionProvider>
    </AlertProvider>
  );
}

export default App;
