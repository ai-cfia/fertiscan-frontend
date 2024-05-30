import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n.js"; // Import the i18n object from the correct module file

ReactDOM.createRoot(document.getElementById("root")!).render(
  <I18nextProvider i18n={i18n}> // Add the i18n prop to the I18nextProvider component
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </I18nextProvider> 
);
