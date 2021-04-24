import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { Route } from "react-router-dom";
import useSocialLogin from "../../providers/social/social.hook";
import useProfile from "../../providers/api/user/user.hook";
import Profile from "../../pages/profile/profile.page";

const ProtectedRoute = ({
  negative,
  attr,
  redirect,
  history,
  ...otherProps
}) => {
  const { social } = useSocialLogin();
  const { profile } = useProfile();

  const [profileInitialized, setProfileIntialized] = React.useState(true);

  const profileSetup = () => {
    if (profile.user.inventory.length === 0) {
      setProfileIntialized(false);
      return;
    }
    if (!profile.user.inventory[0].has_profile_initialized) {
      setProfileIntialized(false);
      return;
    }
    setProfileIntialized(true);
  };

  const handleRedirect = () => {
    if (negative && !social.socialLogin[attr]) {
      history.push(redirect);
    }
    if (!negative && social.socialLogin[attr]) {
      history.push(redirect);
    }
  };

  React.useEffect(() => {
    profileSetup();
  }, [profile]); // eslint-disable-line

  React.useEffect(() => {
    handleRedirect();
  }, [social]); // eslint-disable-line

  React.useEffect(() => {
    profileSetup();
    handleRedirect();
  }, []); // eslint-disable-line

  return profileInitialized ? <Route {...otherProps} /> : <Profile />;
};

export default withRouter(ProtectedRoute);

ProtectedRoute.propTypes = {
  attr: PropTypes.string.isRequired,
  negative: PropTypes.bool,
  redirect: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
