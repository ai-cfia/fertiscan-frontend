import Carousel from "../../Components/Carousel/Carousel";
import Section from "../../Model/Section-Model.tsx";
import Input from "../../Model/Input-Model.tsx";
import "./ConfirmPage.css";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { SessionContext, SetSessionContext } from "../../Utils/SessionContext";

const ConfirmPage = () => {
  const { t } = useTranslation();
  const { state } = useContext(SessionContext);
  const { setState } = useContext(SetSessionContext);
  const data = state.data.form;

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

  const renderInput = (inputInfo: Input) => {
    if (inputInfo.isAlreadyTable) {
      return renderListInput(inputInfo);
    } else if (inputInfo.isInputObjectList) {
      return renderObjectInput(inputInfo);
    } else {
      return inputInfo.value as unknown as string;
    }
  };

  // Traduction not done waiting on prompt changes
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

  const cancel = () => {
    setState({ ...state, state: "form" });
  };

  return (
    <div className="confirm-page-container ${theme}">
      <h1 id="confirm-title">{t("confirmationPage")}</h1>
      <Carousel
        imgs={state.data.pics.map((blob) => ({
          url: blob.blob,
          title: blob.name,
        }))}
      />
      <div className="confirm-container">
        {data.sections.map((section: Section) => renderSection(section))}
        <div className="button-container">
          <button onClick={() => cancel()}>{t("cancelButton")}</button>
          <button onClick={() => console.log("Confirm")}>
            {t("confirmButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPage;
