import Carousel from "../../Components/Carousel/Carousel";
import { useLocation } from "react-router-dom";
import Section from "../../Model/Section-Model.tsx";
import "./ConfirmPage.css";
import { useTranslation } from "react-i18next";

const ConfirmPage = () => {
  
  const location = useLocation();
  const { t } = useTranslation();
  const data = location.state.data;

  // Traduction not done waiting on prompt changes
  const renderSection = (section: Section) => (
    <div key={section.label}>
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
    <div className="confirm-page-container">
      <h1 id="confirm-title">{t("confirmationPage")}</h1>
      <Carousel imgs={location.state.urls} />
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
