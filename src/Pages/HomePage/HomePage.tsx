import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../Utils/Auth/AuthUtil";
import { SessionContext } from "../../Utils/SessionContext";
import CapturPage from "../CapturPage/CapturPage";
import ConfirmPage from "../ConfirmPage/ConfirmPage";
import FormPage from "../FormPage/FormPage";

function HomePage() {
  const navigate = useNavigate();
  const { state } = useContext(SessionContext);

  useEffect(() => {
    if (!isAuthenticated()) navigate("/settings");
  }, [navigate]);

  if (state.state === "form") {
    return <FormPage />;
  } else if (state.state === "validation") {
    return <ConfirmPage />;
  }
  return <CapturPage />;
}

export default HomePage;
