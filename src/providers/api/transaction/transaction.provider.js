import React, { useReducer, createContext } from "react";
import TransactionReducer from "./transaction.reducer";
import InitialState from "./transaction.initial";

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
