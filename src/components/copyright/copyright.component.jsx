import React from "react";
import { useTranslation } from "react-i18next";

import { AnalyticsActions } from "../../providers/analytics/analytics.actions";
import { AnalyticsContext } from "../../providers/analytics/analytics.provider";

import { External } from "../../configuration/routes";

import { CopyrightBox, StyledLink } from "./copyright.styles.jsx";

const Copyright = () => {
  const { t } = useTranslation();
  const year = new Date(Date.now()).getFullYear();
  const { event } = React.useContext(AnalyticsContext);

  const handleClick = () => {
    event(AnalyticsActions.HomePageLink);
  };

  return (
    <CopyrightBox data-testid="CopyRight">
      {t("Copyight.CopyrightDeclaration")}
      <StyledLink
        data-testid="CopyRightLink"
        target={"_blank"}
        href={External.credit}
        onClick={handleClick}
      >
        {t("Copyight.CopyrightMessage")}
      </StyledLink>
      &nbsp;{`${year}.`}
    </CopyrightBox>
  );
};

export default Copyright;
