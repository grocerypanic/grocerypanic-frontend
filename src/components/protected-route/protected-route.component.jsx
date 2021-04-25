import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { Route } from "react-router-dom";
import useSocialLogin from "../../providers/social/social.hook";
import useProfile from "../../providers/api/user/user.hook";
import Profile from "../../pages/profile/profile.page";

const ProtectedRoute = ({
  noProfile,
  negative,
  attr,
  redirect,
  history,
  ...otherProps
}) => {
  const { social } = useSocialLogin();
  const { profile } = useProfile();

  const [profileInitialized, setProfileIntialized] = React.useState(true);

  const needsRedirect = () => {
    if (negative && !social.socialLogin[attr]) return true;
    if (!negative && social.socialLogin[attr]) return true;
  };

  const needsProfileSetup = () => {
    if (needsRedirect()) return false;
    if (noProfile) return false;
    if (profile.user.inventory.length === 0) return true;
    if (!profile.user.inventory[0].has_profile_initialized) return true;
    allowPassThrough();
  };

  const forceRedirect = () => {
    history.push(redirect);
    allowPassThrough();
  };

  const forceProfileSetup = () => {
    setProfileIntialized(false);
  };

  const allowPassThrough = () => {
    setProfileIntialized(true);
  };

  const handlingRouting = () => {
    if (needsRedirect()) forceRedirect();
    if (needsProfileSetup()) forceProfileSetup();
  };

  React.useEffect(() => {
    handlingRouting();
  }, [social, profile]); // eslint-disable-line

  React.useEffect(() => {
    handlingRouting();
  }, []); // eslint-disable-line

  return profileInitialized ? <Route {...otherProps} /> : <Profile />;
};

export default withRouter(ProtectedRoute);

ProtectedRoute.propTypes = {
  noProfile: PropTypes.bool,
  attr: PropTypes.string.isRequired,
  negative: PropTypes.bool,
  redirect: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
