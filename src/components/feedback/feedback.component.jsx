import React from "react";
import { useTranslation } from "react-i18next";

import { AnalyticsActions } from "../../providers/analytics/analytics.actions";
import { AnalyticsContext } from "../../providers/analytics/analytics.provider";

import Strings from "../../configuration/strings";
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
      <span>{t(Strings.FeedBack.Request1)}</span>
      <span data-testid={"FeedBackLink"}>
        {t(Strings.FeedBack.Request2)}
        <StyledLink
          target={"_blank"}
          href={External.feedback}
          onClick={handleClick}
        >
          {t(Strings.FeedBack.Link)}
        </StyledLink>
        {t(Strings.FeedBack.Request3)}
      </span>
    </TextBox>
  );
};

export default FeedBack;
