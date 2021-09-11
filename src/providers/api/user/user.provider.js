import React, { createContext } from "react";
import createPersistedReducer from "use-persisted-reducer";
import InitialState from "./user.initial";
import UserReducer from "./user.reducer";

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
