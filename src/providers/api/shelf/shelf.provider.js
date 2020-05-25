import React, { useReducer, createContext } from "react";
import ShelfReducer from "./shelf.reducer";
import InitialState from "./shelf.initial";

export const ShelfContext = createContext({ ...InitialState });

const ShelfProvider = ({ children }) => {
  const [shelves, dispatch] = useReducer(ShelfReducer, InitialState);

  return (
    <ShelfContext.Provider
      value={{
        apiObject: shelves,
        dispatch,
      }}
    >
      {children}
    </ShelfContext.Provider>
  );
};

export default ShelfProvider;
