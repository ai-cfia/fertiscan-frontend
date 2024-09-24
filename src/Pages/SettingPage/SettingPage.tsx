// SettingPage.js
import { useTranslation } from "react-i18next";
import LanguageButton from "../../Components/LanguageButton/LanguageButton";
import "./SettingPage.css";

function SettingPage() {
  const { t } = useTranslation();

  return (
    <div className="${theme}">
      <h1>{t("settingH1")}</h1>
      <div className="settings">
        <div id="language">
          <label>{t("languageLabel")} : </label>
          <LanguageButton />
        </div>
        <hr />
      </div>
    </div>
  );
}

export default SettingPage;