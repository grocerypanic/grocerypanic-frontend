import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import CookieConsent from "react-cookie-consent";

import { AnalyticsContext } from "../../providers/analytics/analytics.provider";

import messages from "../../configuration/strings";

const Consent = () => {
  const { setup } = useContext(AnalyticsContext);
  const { t } = useTranslation();

  return (
    <CookieConsent
      enableDeclineButton
      onAccept={setup}
      buttonText={t(messages.CookieAcceptText)}
      declineButtonText={t(messages.CookieDeclineText)}
    >
      {t(messages.CookieMessage)}
    </CookieConsent>
  );
};

export default Consent;
