import Carousel from "../../Components/Carousel/Carousel";
import Section from "../../Model/Section-Model.tsx";
import Input from "../../Model/Input-Model.tsx";
import Data from "../../Model/Data-Model.tsx";
import "./ConfirmPage.css";
import { useTranslation } from "react-i18next";
import { useContext, useState } from "react";
import { SessionContext, SetSessionContext } from "../../Utils/SessionContext";
import { useAlert } from "../../Utils/AlertContext.tsx";

const ConfirmPage = () => {
  const { t } = useTranslation();
  const { state } = useContext(SessionContext);
  const { setState } = useContext(SetSessionContext);
  const data = state.data.form;
  const { showAlert } = useAlert();

  const renderInput = (inputInfo: Input) => {
    if (inputInfo.isAlreadyTable) {
      return renderListInput(inputInfo);
    } else if (inputInfo.isInputObjectList) {
      return renderObjectInput(inputInfo);
    } else {
      return inputInfo.value as unknown as string;
    }
  };

  const cancel = () => {
    setState({ ...state, state: "form" });
  };

  const submitForm = () => {
    fetch(process.env.API_URL + "/inspections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + "user1:password1",
      },
      body: JSON.stringify(state.data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setState({ state: "capture", data: { pics: [], form: new Data([]) } });
        showAlert(t("confirmSuccess"), "confirm");
      })
      .catch((error) => {
        console.error("Error:", error);
        showAlert(t("confirmError") + ` : ${error}`, "error");
      });
  };

  const renderListInput = (inputInfo: Input) => {
    return (
      <ul>
        {inputInfo.value.map((value, index) => (
          <li key={index}>{value as string}</li>
        ))}
      </ul>
    );
  };

  const renderObjectInput = (inputInfo: Input) => {
    const keys = Object.keys(
      (inputInfo.value as { [key: string]: string }[])[0],
    );
    return (
      <div id={inputInfo.id} className="object-input">
        <table>
          <colgroup>
            <col span={1} style={{ width: "40%" }} />
            <col span={1} style={{ width: "20%" }} />
            <col span={1} style={{ width: "15%" }} />
          </colgroup>
          <thead>
            {keys.map((key, index) => {
              return <th key={index}>{key}</th>;
            })}
          </thead>
          <tbody>
            {inputInfo.value.map((_obj, index) => {
              return (
                <tr key={index}>
                  <td>
                    <p>
                      {
                        (inputInfo.value[index] as { [key: string]: string })[
                          keys[0]
                        ]
                      }
                    </p>
                  </td>
                  <td>
                    <p>
                      {
                        (inputInfo.value[index] as { [key: string]: string })[
                          keys[1]
                        ]
                      }
                    </p>
                  </td>
                  <td>
                    <p>
                      {
                        (inputInfo.value[index] as { [key: string]: string })[
                          keys[2]
                        ]
                      }
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderSection = (section: Section) => (
    <div key={section.label} className="${theme}">
      <h2>{t(section.title)}</h2>
      <ul className="data-infos">
        {section.inputs.map((input) => (
          <li key={input.id}>
            <b>{input.label}:</b> {renderInput(input)}
          </li>
        ))}
      </ul>
    </div>
  );

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
        {data.sections.map((section: Section) => renderSection(section))}
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
