import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import Form from "./Form.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Form />
  </React.StrictMode>,
);
