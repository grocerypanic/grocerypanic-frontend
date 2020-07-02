import React from "react";
import { useTranslation } from "react-i18next";

import { AnalyticsActions } from "../../providers/analytics/analytics.actions";
import { AnalyticsContext } from "../../providers/analytics/analytics.provider";

import { External } from "../../configuration/routes";

import { TextBox, StyledLink } from "./feedback.styles.jsx";

const FeedBack = () => {
  const { t } = useTranslation();
  const { event } = React.useContext(AnalyticsContext);

  const handleClick = () => {
    event(AnalyticsActions.FeedBackLink);
  };

  return (
    <TextBox data-testid="FeedBack">
      <span>{t("FeedBack.Request1")}</span>
      <span data-testid={"FeedBackLink"}>
        {t("FeedBack.Request2")}
        <StyledLink
          target={"_blank"}
          href={External.feedback}
          onClick={handleClick}
        >
          {t("FeedBack.Link")}
        </StyledLink>
        {t("FeedBack.Request3")}
      </span>
    </TextBox>
  );
};

export default FeedBack;
