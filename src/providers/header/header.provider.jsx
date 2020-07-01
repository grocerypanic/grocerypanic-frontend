import React, { useState, createContext } from "react";
import InitialState from "./header.initial";

export const HeaderContext = createContext({ ...InitialState });

const HeaderProvider = ({ children }) => {
  const [headerSettings, setHeaderSettings] = useState(
    InitialState.headerSettings
  );

  const updateHeader = (newSettings) => {
    setHeaderSettings(newSettings);
  };

  return (
    <HeaderContext.Provider
      value={{
        headerSettings,
        updateHeader,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export default HeaderProvider;
