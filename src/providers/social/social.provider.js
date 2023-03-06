import { GoogleOAuthProvider } from "@react-oauth/google";
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
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_ACCOUNT_ID}>
      <SocialContext.Provider
        value={{
          socialLogin,
          dispatch,
        }}
      >
        {children}
      </SocialContext.Provider>
    </GoogleOAuthProvider>
  );
};

export default SocialProvider;
