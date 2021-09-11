import React, { useReducer, createContext } from "react";
import InitialState from "./transaction.initial";
import TransactionReducer from "./transaction.reducer";

export const TransactionContext = createContext({ ...InitialState });

const TransactionProvider = ({ children }) => {
  const [transactions, dispatch] = useReducer(TransactionReducer, InitialState);

  return (
    <TransactionContext.Provider
      value={{
        apiObject: transactions,
        dispatch,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionProvider;
