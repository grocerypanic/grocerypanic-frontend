// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

// Manual mocking DID NOT work for this, but this global mock works nicely.
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
  Trans: ({ children }) => children,
  I18nextProvider: ({ children }) => children,
  withTranslation: () => (Component) => {
    Component.defaultProps = { ...Component.defaultProps, t: (key) => key };
    return Component;
  },
}));

global.fail = (message) => {
  throw new Error(message);
};
