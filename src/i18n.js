import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import your translations (replace with your actual files)
import en from "../public/locales/en.json";
import fr from "../public/locales/fr.json";

i18n
  .use(initReactI18next) // Initializes i18n with React
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    lng: "en", // Default language (can be changed dynamically)
    interpolation: {
      escapeValue: false, // React already handles escaping
    },
  });

export default i18n;
