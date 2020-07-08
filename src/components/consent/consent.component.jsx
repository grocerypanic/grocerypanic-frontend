import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import CookieConsent from "react-cookie-consent";
import cookie from "cookie_js";

import { AnalyticsContext } from "../../providers/analytics/analytics.provider";

import { Constants } from "../../configuration/backend";

const Consent = () => {
  const { setup } = useContext(AnalyticsContext);
  const { t } = useTranslation();

  React.useEffect(() => {
    if (cookie.get(Constants.AnalyticsCookieName) === "true") {
      setup();
    }
  }, []); // eslint-disable-line

  if (cookie.get(Constants.AnalyticsCookieName) === "true") {
    return null;
  }

  return (
    <CookieConsent
      cookieName={Constants.AnalyticsCookieName}
      enableDeclineButton
      onAccept={setup}
      buttonText={t("CookiePolicy.CookieAcceptText")}
      declineButtonText={t("CookiePolicy.CookieDeclineText")}
    >
      {t("CookiePolicy.CookieMessage")}
    </CookieConsent>
  );
};

export default Consent;
