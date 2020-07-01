import React, { useState, createContext } from "react";
import InitialState from "./header.initial";

export const HeaderContext = createContext({ ...InitialState });

const HeaderProvider = ({ children }) => {
  const [title, setTitle] = useState(InitialState.headerSettings.title);
  const [create, setCreate] = useState(InitialState.headerSettings.create);
  const [transaction, setTransaction] = useState(
    InitialState.headerSettings.transaction
  );
  const [disableNav, setDisableNav] = useState(
    InitialState.headerSettings.disableNav
  );

  const updateHeader = (newSettings) => {
    if (newSettings.title !== undefined) setTitle(newSettings.title);
    if (newSettings.create !== undefined) setCreate(newSettings.create);
    if (newSettings.transaction !== undefined)
      setTransaction(newSettings.transaction);
    if (newSettings.disableNav !== undefined)
      setDisableNav(newSettings.disableNav);
  };

  return (
    <HeaderContext.Provider
      value={{
        headerSettings: {
          title,
          create,
          transaction,
          disableNav,
        },
        updateHeader,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export default HeaderProvider;
