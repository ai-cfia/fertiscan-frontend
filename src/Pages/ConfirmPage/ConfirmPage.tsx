import Carousel from "../../Components/Carousel/Carousel";
import Section from "../../Model/Section-Model.tsx";
import "./ConfirmPage.css";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { SessionContext } from "../../Utils/SessionContext";

const ConfirmPage = () => {
  const { t } = useTranslation();
  const { state } = useContext(SessionContext);
  const data = state.data.form;

  // Traduction not done waiting on prompt changes
  const renderSection = (section: Section) => (
    <div key={section.label} className="${theme}">
      <h2>{section.label}</h2>
      <ul className="data-infos">
        {section.inputs.map((input) => (
          <li key={input.id}>
            <b>{input.label}:</b> {input.value}
          </li>
        ))}
      </ul>
    </div>
  );

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
          <button onClick={() => console.log("Cancel")}>
            {t("cancelButton")}
          </button>
          <button onClick={() => console.log("Confirm")}>
            {t("confirmButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPage;
