// Provides react-ga to all components that need to send data
import ReactGA from "react-ga";
import React, { useState, createContext } from "react";
import InitialValues from "./analytics.initial";
import { withRouter } from "react-router-dom";

export const AnalyticsContext = createContext(InitialValues);

export const AnalyticsCookieName = "CookieConsent";

export const getConsentCookie = () => {
  const name = AnalyticsCookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      /* istanbul ignore next */
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

const AnalyticsProvider = ({ children, history }) => {
  const [initialized, setInitialize] = useState(false);

  const event = (data) => {
    if (initialized) {
      ReactGA.event(data);
    }
    if (getConsentCookie() === "true") {
      return setup(data);
    } else {
      return;
    }
  };

  const setup = (data) => {
    if (initialized || !process.env.REACT_APP_UA_CODE) return;
    ReactGA.initialize(process.env.REACT_APP_UA_CODE, {
      debug: process.env.NODE_ENV === "production" ? false : true,
    });
    history.listen((location) => {
      ReactGA.set({ page: location.pathname });
      ReactGA.pageview(location.pathname);
    });
    setInitialize(true);
    if (data) ReactGA.event(data);
  };

  return (
    <AnalyticsContext.Provider
      value={{
        event,
        initialized,
        setup,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export default withRouter(AnalyticsProvider);
