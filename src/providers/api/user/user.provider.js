import React, { createContext } from "react";
import UserReducer from "./user.reducer";
import InitialState from "./user.initial";
import createPersistedReducer from "use-persisted-reducer";

export const UserContext = createContext({ ...InitialState });
const usePersistedReducer = createPersistedReducer("user-profile");

const UserProvider = ({ children }) => {
  const [user, dispatch] = usePersistedReducer(UserReducer, InitialState);

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
