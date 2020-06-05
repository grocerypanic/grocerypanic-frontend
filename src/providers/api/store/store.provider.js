import React, { useReducer, createContext } from "react";
import StoreReducer from "./store.reducer";
import InitialState from "./store.initial";

export const StoreContext = createContext({ ...InitialState });

const StoreProvider = ({ children }) => {
  const [shelves, dispatch] = useReducer(StoreReducer, InitialState);

  return (
    <StoreContext.Provider
      value={{
        apiObject: shelves,
        dispatch,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
