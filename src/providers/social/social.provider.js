import React, { createContext } from "react";
import createPersistedReducer from "use-persisted-reducer";
import InitialState from "./social.initial";
import SocialReducer from "./social.reducer";

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
