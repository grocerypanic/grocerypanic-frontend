import React, { createContext } from "react";
import UserReducer from "./user.reducer";
import InitialState from "./user.initial";
import createPersistedReducer from "use-persisted-reducer";

export const UserContext = createContext({ ...InitialState });
const usePersistedReducer = createPersistedReducer("user-state");

const UserProvider = ({ children }) => {
  const [user, dispatch] = usePersistedReducer(UserReducer, InitialState);

  return (
    <UserContext.Provider
      value={{
        user,
        dispatch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
