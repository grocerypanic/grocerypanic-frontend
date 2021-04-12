import React, { useReducer, createContext } from "react";
import StoreReducer from "./store.reducer";
import InitialState from "./store.initial";

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
