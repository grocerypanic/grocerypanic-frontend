import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import CookieConsent from "react-cookie-consent";

import { AnalyticsContext } from "../../providers/analytics/analytics.provider";

import Strings from "../../configuration/strings";

const Consent = () => {
  const { setup } = useContext(AnalyticsContext);
  const { t } = useTranslation();

  return (
    <CookieConsent
      enableDeclineButton
      onAccept={setup}
      buttonText={t(Strings.CookiePolicy.CookieAcceptText)}
      declineButtonText={t(Strings.CookiePolicy.CookieDeclineText)}
    >
      {t(Strings.CookiePolicy.CookieMessage)}
    </CookieConsent>
  );
};

export default Consent;
