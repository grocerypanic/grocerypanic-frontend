import React, { useReducer, createContext } from "react";
import UserReducer from "./user.reducer";
import InitialState from "./user.initial";

export const UserContext = createContext({ ...InitialState });

const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(UserReducer, InitialState);

  return (
    <UserContext.Provider
      value={{
        apiObject: user,
        dispatch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
