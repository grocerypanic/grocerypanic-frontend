import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Strings from "./strings";

const i18nConfig = {
  fallbackLng: "en",
  debug: false,
  ns: ["translations"],
  defaultNS: "translations",
  keySeparator: false,
  interpolation: {
    escapeValue: false,
    formatSeparator: ",",
  },
  react: {
    wait: true,
  },
};

i18n.use(LanguageDetector).init({
  resources: {
    ...Strings,
  },
  ...i18nConfig,
});

export default i18n;
