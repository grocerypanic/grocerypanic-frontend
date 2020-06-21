import React, { useReducer, createContext } from "react";
import TransactionReducer from "./transaction.reducer";
import InitialState from "./transaction.initial";

export const TransactionContext = createContext({ ...InitialState });

const TransactionProvider = ({ children }) => {
  const [shelves, dispatch] = useReducer(TransactionReducer, InitialState);

  return (
    <TransactionContext.Provider
      value={{
        apiObject: shelves,
        dispatch,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionProvider;
