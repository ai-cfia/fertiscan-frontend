import Carousel from "../../Components/Carousel/Carousel";
import "./ConfirmPage.css";
import { useTranslation } from "react-i18next";
import { useContext, useState } from "react";
import { SessionContext, SetSessionContext } from "../../Utils/SessionContext";
import Label from "../../Components/Label/Label.tsx";

const ConfirmPage = () => {
  const { t } = useTranslation();
  const { state } = useContext(SessionContext);
  const { setState } = useContext(SetSessionContext);
  const data = state.data.form;

  const cancel = () => {
    setState({ ...state, state: "form" });
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
            onClick={() => console.log("Confirm")}
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
