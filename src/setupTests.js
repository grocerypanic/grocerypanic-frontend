// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
import "jest-styled-components";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { Strings } from "./configuration/strings";

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  ns: ["translation"],
  defaultNS: "translation",
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  resources: { ...Strings },
});

export default i18n;

global.fail = (message) => {
  throw new Error(message);
};
