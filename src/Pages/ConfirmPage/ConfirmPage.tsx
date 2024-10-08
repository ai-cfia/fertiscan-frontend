import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import Carousel from "../../Components/Carousel/Carousel";
import Label from "../../Components/Label/Label.tsx";
import Data from "../../Model/Data-Model.tsx";
import { useAlert } from "../../Utils/AlertContext.tsx";
import { SessionContext, SetSessionContext } from "../../Utils/SessionContext";
import "./ConfirmPage.css";
import Inspection from "../../interfaces/Inspection.ts";
import { createInspectionFromData } from "../../Utils/FormCreator.ts";

const ConfirmPage = () => {
  const { t } = useTranslation();
  const { state } = useContext(SessionContext);
  const { setState } = useContext(SetSessionContext);
  const data = state.data.form;
  const { showAlert } = useAlert();

  const cancel = () => {
    setState({ ...state, state: "form" });
  };

  const submitForm = () => {
    const inspection = createInspectionFromData(data, state.data.inspection);

    fetch(
      process.env.VITE_API_URL + "/inspections/" + inspection.inspection_id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " + document.cookie.split("auth=")[1].split(";")[0],
        },
        body: JSON.stringify(inspection),
      },
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        console.log("Success:", data);
        setState({
          state: "capture",
          data: { pics: [], form: new Data([]), inspection: {} as Inspection },
        });
        showAlert(t("confirmSuccess"), "confirm");
      })
      .catch((error) => {
        console.error("Error:", error);
        showAlert(t("confirmError") + ` : ${error}`, "error");
      });
  };

  const [isChecked, setIsChecked] = useState(false);

  // eslint-disable-next-line
  const handleChange = (event: { target: { checked: any } }) => {
    // Actualiser l'état avec la nouvelle valeur de la case à cocher
    setIsChecked(event.target.checked);
    if (event.target.checked) {
      console.log("Checkbox is checked.");
    } else {
      console.log("Checkbox is not checked.");
    }
  };

  return (
    <div className="confirm-page-container ${theme} disable-scroll">
      <h1 id="confirm-title">{t("confirmationPage")}</h1>
      <Carousel
        imgs={state.data.pics.map((blob) => ({
          url: blob.blob,
          title: blob.name,
        }))}
        id={"carousel"}
      />
      <div className="confirm-container">
        <Label sections={data.sections} />
        <div className="checkbox-container">
          <input
            id="confirmation-checkbox"
            type="checkbox"
            checked={isChecked}
            onChange={handleChange}
            className="checkbox-input"
          />
          <label htmlFor="confirmation-checkbox" className="checkbox-label">
            {t("confirmationCheckbox")}
          </label>
        </div>
        <div className="button-container-confirmPage">
          <button className="button-confirmPage" onClick={() => cancel()}>
            {t("cancelButton")}
          </button>
          <button
            className="button-confirmPage"
            onClick={() => submitForm()}
            disabled={!isChecked}
          >
            {t("confirmButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPage;
