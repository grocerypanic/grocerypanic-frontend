import React from "react";
import SignIn from "./signin.page";
import ErrorDialogue from "../../components/error-dialogue/error-dialogue.component";
import HoldingPattern from "../../components/holding-pattern/holding-pattern.component";
import { AnalyticsActions } from "../../providers/analytics/analytics.actions";
import { AnalyticsContext } from "../../providers/analytics/analytics.provider";
import useProfile from "../../providers/api/user/user.hook";
import { HeaderContext } from "../../providers/header/header.provider";
import useSocialLogin from "../../providers/social/social.hook";

const SignInContainer = () => {
  const { event } = React.useContext(AnalyticsContext);
  const { profile } = useProfile();
  const { social } = useSocialLogin();
  const [inProgress, setInProgress] = React.useState(false);

  const { updateHeader } = React.useContext(HeaderContext);

  React.useEffect(() => {
    setInProgress(false);
    updateHeader({
      title: "MainHeaderTitle",
      disableNav: true,
    });
  }, []); // eslint-disable-line

  React.useEffect(() => {
    if (social.socialLogin.login) {
      profile.getProfile();
      setInProgress(false);
    }
  }, [social.socialLogin.login]); // eslint-disable-line

  const handleSocialLogin = (response) => {
    event(AnalyticsActions.LoginSuccess);
    setInProgress(true);
    social.login(response);
  };

  const handleSocialLoginError = () => {
    setInProgress(false);
    social.error();
  };

  const clearLogin = () => {
    setInProgress(false);
    social.reset();
  };

  return (
    <div>
      {social.socialLogin.error ? (
        <ErrorDialogue
          eventError={AnalyticsActions.LoginError}
          clearError={clearLogin}
          messageTranslationKey={social.socialLogin.errorMessage}
        />
      ) : (
        <HoldingPattern condition={inProgress || profile.user.transaction}>
          <SignIn
            handleSocialLogin={handleSocialLogin}
            handleSocialLoginError={handleSocialLoginError}
          />
        </HoldingPattern>
      )}
    </div>
  );
};

export default SignInContainer;
