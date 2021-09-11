import React, { useReducer, createContext } from "react";
import InitialState from "./shelf.initial";
import ShelfReducer from "./shelf.reducer";

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
