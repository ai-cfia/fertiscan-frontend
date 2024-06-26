import { useEffect, useState } from "react";
import "./LanguageButton.css"; // Import CSS file for animations
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const LanguageButton = () => {
  const [language, setLanguage] = useState("en");
  const { t } = useTranslation();

  const changeLanguage = (newLang: string): void => {
    setLanguage(newLang);
    i18next.changeLanguage(newLang); // Assuming i18next instance available
    localStorage.setItem("language", newLang);
  };

  const handleLanguageSwap = () => {
    const newLanguage = language === "en" ? "fr" : "en";
    changeLanguage(newLanguage); // Update language state and i18next
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage);
      i18next.changeLanguage(storedLanguage); // Use i18next for consistency
    }
  }, []);

  const buttonText = t(`${language}`); // Translation key with language suffix

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
