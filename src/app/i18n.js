import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ChainedBackend from "i18next-chained-backend";
import HttpBackend from "i18next-http-backend";
import Backend from "i18next-http-backend";
import resourcesToBackend from "i18next-resources-to-backend";

import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(Backend)
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)

  .use(ChainedBackend)
  // init i18next
  .init({
    debug: false,
    fallbackLng: "fr",
    lng: ["en", "fr"],
    interpolation: {
      escapeValue: false,
    },

    backend: {
      backends: [
        HttpBackend,
        resourcesToBackend(
          (lng, ns) => import(`../../public/locales/${lng}/${ns}.json`),
        ),
      ],
      backendOptions: [
        {
          loadPath: "/locales/{{lng}}/{{ns}}.json",
        },
        {
          loadPath: "http://localhost:3000/locales/{{lng}}/{{ns}}.json",
        },
        {
          loadPath:
            "https://fertiscan.inspection.alpha.canada.ca/locales/{{lng}}/{{ns}}.json",
        },
      ],
    },
  });

export default i18n;
