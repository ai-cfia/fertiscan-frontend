import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../Utils/Auth/AuthUtil";
import "./NoPage.css";

function NoPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) navigate("/settings");
  }, []);
  return (
    <>
      <p className="${theme}">404</p>
    </>
  );
}

export default NoPage;
