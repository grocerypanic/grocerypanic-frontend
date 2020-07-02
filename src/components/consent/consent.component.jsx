import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import CookieConsent from "react-cookie-consent";
import cookie from "cookie_js";

import { AnalyticsContext } from "../../providers/analytics/analytics.provider";

export const AnalyticsCookieName = "CookieConsent";

const Consent = () => {
  const { setup } = useContext(AnalyticsContext);
  const { t } = useTranslation();

  if (cookie.get(AnalyticsCookieName) === "true") {
    setup();
    return null;
  }

  return (
    <CookieConsent
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
