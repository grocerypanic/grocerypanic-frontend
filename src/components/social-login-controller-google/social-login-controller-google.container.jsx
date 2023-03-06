import { useGoogleLogin } from "@react-oauth/google";
import PropTypes from "prop-types";
import { Providers } from "../../configuration/backend";
import StandBy from "../social-login-standby/social-login-standby.component";

const SocialLoginControllerGoogle = ({
  ButtonType,
  fallbackMessage,
  message,
  onLoginSuccess,
  onLoginFailure,
}) => {
  const remapResponse = (response) => {
    onLoginSuccess({
      _provider: Providers.google,
      _token: {
        access_token: response.access_token,
        idToken: response.code,
      },
    });
  };

  const login = useGoogleLogin({
    flow: "auth-code",
    onError: onLoginFailure,
    onSuccess: remapResponse,
    select_account: true,
  });

  if (!global.google || !global.google.accounts)
    return <StandBy>{fallbackMessage}</StandBy>;

  return <ButtonType onClick={login}>{message}</ButtonType>;
};

SocialLoginControllerGoogle.propTypes = {
  ButtonType: PropTypes.func.isRequired,
  fallbackMessage: PropTypes.string.isRequired,
  onLoginFailure: PropTypes.func.isRequired,
  onLoginSuccess: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default SocialLoginControllerGoogle;
