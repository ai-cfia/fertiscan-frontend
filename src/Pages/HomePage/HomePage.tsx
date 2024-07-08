import "./HomePage.css";
import { useContext } from "react";
import { SessionContext } from "../../Utils/SessionContext";
import CapturPage from "../CapturPage/CapturPage";
import FormPage from "../FormPage/FormPage";
import ConfirmPage from "../ConfirmPage/ConfirmPage";
import AlertBanner from "../../Components/AlertBanner/AlertBanner";

function HomePage() {
  const { state } = useContext(SessionContext);
  if (state.state === "form") {
    return (
      <>
        <AlertBanner />
        <FormPage />
      </>
    );
  } else if (state.state === "validation") {
    return (
      <>
        <AlertBanner />
        <ConfirmPage />
      </>
    );
  }
  return (
    <>
      <AlertBanner />
      <CapturPage />
    </>
  );
}

export default HomePage;
