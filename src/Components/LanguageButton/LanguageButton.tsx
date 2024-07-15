import { useEffect, useState } from "react";
import "./LanguageButton.css";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const LanguageButton = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState("en");
  const buttonText = t(`${language}`);

  const changeLanguage = (newLang: string): void => {
    setLanguage(newLang);
    i18next.changeLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const handleLanguageSwap = () => {
    const newLanguage = language === "en" ? "fr" : "en";
    changeLanguage(newLanguage);
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage);
      i18next.changeLanguage(storedLanguage);
    }
  }, []);

  return (
    <button
      className={`language-button ${language}`}
      onClick={handleLanguageSwap}
    >
      {buttonText}
    </button>
  );
};

export default LanguageButton;
