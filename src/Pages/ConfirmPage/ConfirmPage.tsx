import Carousel from "../../Components/Carousel/Carousel";
import "./ConfirmPage.css";
import { useTranslation } from "react-i18next";
import { useContext, useState } from "react";
import { SessionContext, SetSessionContext } from "../../Utils/SessionContext";
import Label from "../../Components/Label/Label.tsx";
import { useAlert } from "../../Utils/AlertContext.tsx";
import Data from "../../Model/Data-Model.tsx";

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
    const to_send : {[key:string]:(string|string[] | { [key: string]: string }[] | {} )} =
    {
      company_name:"",
      company_address:"",
      company_website:"",
      company_phone_number:"",
      manufacturer_name:"",
      manufacturer_address:"",
      manufacturer_website:"",
      manufacturer_phone_number:"",
      fertiliser_name:"",
      registration_number:"",
      lot_number:"",
      weight:[],
      density:{
        value:"",
        unit:""
      },
      volume:{
        value:"",
        unit:""
      },
      npk:"",
      warranty:"",
      cautions_en:[],
      instructions_en:[],
      micronutrients_en:[],
      ingredients_en:[],
      specifications_en:[],
      first_aid_en:[],
      cautions_fr:[],
      instructions_fr:[],
      micronutrients_fr:[],
      ingredients_fr:[],
      specifications_fr:[],
      first_aid_fr:[],
      guaranteed_analysis:[],
    }

    Object.keys(to_send).forEach(key => {
      const value = data.sections.find(section=> key.startsWith(section.label))?.inputs.find(input=>key===input.id)?.value
      if (["string","object"].indexOf(typeof to_send[key]) > -1 && value){
        to_send[key] = value[0]
      }else if(value){
        to_send[key] = value
      }
    })

    fetch(process.env.VITE_API_URL + "/inspections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + document.cookie.split("auth=")[1].split(";")[0],
      },
      body: JSON.stringify(state.data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        console.log("Success:", data);
        setState({ state: "capture", data: { pics: [], form: new Data([]) } });
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
