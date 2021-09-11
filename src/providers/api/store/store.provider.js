import React, { useReducer, createContext } from "react";
import InitialState from "./store.initial";
import StoreReducer from "./store.reducer";

export const StoreContext = createContext({ ...InitialState });

const StoreProvider = ({ children }) => {
  const [stores, dispatch] = useReducer(StoreReducer, InitialState);

  return (
    <StoreContext.Provider
      value={{
        apiObject: stores,
        dispatch,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
