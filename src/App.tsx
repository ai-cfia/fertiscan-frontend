import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import JsonPage from "./Pages/JsonPage/Json"
import NoPage from "./Pages/NoPage/NoPage";
import "./App.css";
import Header from "./Components/Header/Header";

function App() {
  return (
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
  );
}

export default App;
