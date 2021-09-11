import React, { useReducer, createContext } from "react";
import InitialState from "./item.initial";
import ItemReducer from "./item.reducer";

export const ItemContext = createContext({ ...InitialState });

const ItemProvider = ({ children }) => {
  const [items, dispatch] = useReducer(ItemReducer, InitialState);

  return (
    <ItemContext.Provider
      value={{
        apiObject: items,
        dispatch,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};

export default ItemProvider;
