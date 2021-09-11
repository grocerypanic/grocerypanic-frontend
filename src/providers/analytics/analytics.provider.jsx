// Provides react-ga to all components that need to send data
import React, { useState, createContext } from "react";
import ReactGA from "react-ga";
import { withRouter } from "react-router-dom";
import InitialValues from "./analytics.initial";

export const AnalyticsContext = createContext(InitialValues);

const AnalyticsProvider = ({ children, history }) => {
  const [initialized, setInitialize] = useState(false);

  const event = (data) => {
    if (initialized) {
      ReactGA.event(data);
    }
  };

  const setup = () => {
    if (initialized || !process.env.REACT_APP_UA_CODE) return;
    ReactGA.initialize(process.env.REACT_APP_UA_CODE, {
      debug: process.env.NODE_ENV === "production" ? false : true,
    });
    history.listen((location) => {
      ReactGA.set({ page: location.pathname });
      ReactGA.pageview(location.pathname);
    });
    setInitialize(true);
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
