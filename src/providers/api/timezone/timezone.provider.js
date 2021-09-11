import React, { createContext, useReducer } from "react";
import InitialState from "./timezone.initial";
import UserReducer from "./timezone.reducer";

export const TimezoneContext = createContext({ ...InitialState });

const TimezonesProvider = ({ children }) => {
  const [timezones, dispatch] = useReducer(UserReducer, InitialState);

  return (
    <TimezoneContext.Provider
      value={{
        apiObject: timezones,
        dispatch,
      }}
    >
      {children}
    </TimezoneContext.Provider>
  );
};

export default TimezonesProvider;
