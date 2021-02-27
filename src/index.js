import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import RootProvider from "./providers/root.provider";
import i18n from "./configuration/localization";

import App from "./pages/app/app";
import Maintenance from "./pages/maintenance/maintenance.page";
import * as serviceWorker from "./serviceWorker";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

export const Index = () => {
  return (
    <React.StrictMode>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <RootProvider>
            {process.env.REACT_APP_MAINTENANCE === "true" ? (
              <Maintenance />
            ) : (
              <App />
            )}
          </RootProvider>
        </BrowserRouter>
      </I18nextProvider>
    </React.StrictMode>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

export const performUpdate = (registration) => {
  if (registration && registration.waiting) {
    const confirmation = window.confirm(
      "New version available!  Ready to update?"
    );
    if (!confirmation) return;
    registration.waiting.postMessage({ type: "SKIP_WAITING" });
    window.location.reload();
  }
};

if (process.env.REACT_APP_MAINTENANCE === "true") {
  serviceWorker.unregister();
} else {
  serviceWorker.register({
    onUpdate: (registration) => performUpdate(registration),
  });
}
