import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import JsonPage from "./Pages/JsonPage/Json"
import NoPage from "./Pages/NoPage/NoPage";
import "./App.css";
import Header from "./Components/Header/Header";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="Json" element={<JsonPage/>}/>
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;
