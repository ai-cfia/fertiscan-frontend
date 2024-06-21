import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import JsonPage from "./Pages/JsonPage/Json";
import NoPage from "./Pages/NoPage/NoPage";
import "./App.css";
import Header from "./Components/Header/Header";
import FormPage from "./Pages/FormPage/FormPage";
import { StrictMode } from "react";
import ConfirmPage from "./Pages/ConfirmPage/ConfirmPage";

function App() {
  return (
    <BrowserRouter>
      <StrictMode>
        <Header />
      </StrictMode>
      <Routes>
        <Route path="/">
          <Route index element={<HomePage />} />

          <Route path="Json" element={<JsonPage />} />
          <Route path="Form" element={<FormPage />} />
          <Route path="Confirm" element={<ConfirmPage />} />

          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
