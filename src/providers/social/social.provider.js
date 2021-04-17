import React, { createContext } from "react";
import SocialReducer from "./social.reducer";
import InitialState from "./social.initial";
import createPersistedReducer from "use-persisted-reducer";

export const SocialContext = createContext({ ...InitialState });

const usePersistedReducer = createPersistedReducer("user-login");

const SocialProvider = ({ children }) => {
  const [socialLogin, dispatch] = usePersistedReducer(
    SocialReducer,
    InitialState
  );

  return (
    <SocialContext.Provider
      value={{
        socialLogin,
        dispatch,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
};

export default SocialProvider;
