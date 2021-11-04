import { createContext, ReactChild } from "react";
import createPersistedReducer from "use-persisted-reducer";
import { UserContextInitial } from "./user.initial";
import UserReducer from "./user.reducer";

const usePersistedReducer = createPersistedReducer("UserProvider");
export const UserContext = createContext({ ...UserContextInitial });

interface UserProviderProps {
  children: ReactChild | ReactChild[];
}

const UserProvider = ({ children }: UserProviderProps) => {
  const [socialLogin, dispatch] = usePersistedReducer(
    UserReducer,
    UserContextInitial.socialLogin
  );

  return (
    <UserContext.Provider
      value={{
        socialLogin,
        dispatch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
