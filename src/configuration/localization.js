import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { Strings } from "./strings";

const isNotProductionOrTest = () =>
  process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test";

const i18nConfig = {
  fallbackLng: {
    default: ["en"],
  },
  debug: isNotProductionOrTest() ? true : false,
  ns: ["translation"],
  defaultNS: "translation",
  keySeparator: ".",
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
