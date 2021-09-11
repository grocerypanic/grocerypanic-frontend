// For editing user profiles

import PropTypes from "prop-types";
import React from "react";
import ProfileForm from "./profile.edit.form.component";
import { AnalyticsActions } from "../../providers/analytics/analytics.actions";
import { AnalyticsContext } from "../../providers/analytics/analytics.provider";
import ApiActions from "../../providers/api/api.actions";
import useTimezones from "../../providers/api/timezone/timezone.hook";
import useProfile from "../../providers/api/user/user.hook";
import { HeaderContext } from "../../providers/header/header.provider";
import useSocialLogin from "../../providers/social/social.hook";
import ErrorHandler from "../error-handler/error-handler.component";
import HoldingPattern from "../holding-pattern/holding-pattern.component";

const UserProfileEditContainer = ({ headerTitle, helpText, title }) => {
  const { profile } = useProfile();
  const { social } = useSocialLogin();
  const { timezones } = useTimezones();

  const { event } = React.useContext(AnalyticsContext);
  const { updateHeader } = React.useContext(HeaderContext);

  React.useEffect(() => {
    updateHeader({
      title: headerTitle,
      create: null,
      transaction: profile.user.transaction || timezones.timezones.transaction,
      disableNav: false,
    });
  }, [profile.user.transaction, timezones.timezones.transaction]); // eslint-disable-line

  React.useEffect(() => {
    if (profile.user.errorMessage === ApiActions.FailureAuth) {
      profile.clearErrors();
      handleExpiredAuth();
    }
    if (timezones.timezones.errorMessage === ApiActions.FailureAuth) {
      timezones.clearErrors();
      handleExpiredAuth();
    }
  }, [profile.user.errorMessage, timezones.timezones.errorMessage]); // eslint-disable-line

  React.useEffect(() => {
    if (timezones.timezones.inventory.length === 0) timezones.getTimezones();
    profile.getProfile();
  }, []); // eslint-disable-line

  const handleSave = (userProfile) => {
    if (profile.user.transaction || timezones.timezones.transaction) return;
    event(AnalyticsActions.ProfileModified);
    profile.updateProfile({ ...userProfile });
  };

  const handleExpiredAuth = () => {
    social.expiredAuth();
  };

  return (
    <ErrorHandler
      condition={profile.user.fail || timezones.timezones.fail}
      clearError={profile.clearErrors}
      eventMessage={AnalyticsActions.ApiError}
      messageTranslationKey={"Profile.ApiError"}
    >
      <HoldingPattern
        condition={
          profile.user.inventory.length === 0 ||
          timezones.timezones.inventory.length === 0
        }
      >
        <ProfileForm
          user={profile.user.inventory}
          title={title}
          helpText={helpText}
          transaction={profile.user.transaction}
          handleSave={handleSave}
          timezones={timezones.timezones.inventory}
        />
      </HoldingPattern>
    </ErrorHandler>
  );
};

export default UserProfileEditContainer;

UserProfileEditContainer.propTypes = {
  headerTitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  helpText: PropTypes.string.isRequired,
};
