import React from "react";
import { useTranslation } from "react-i18next";

import Strings from "../../configuration/strings";
import { External } from "../../configuration/routes";

import { TextBox, StyledLink } from "./feedback.styles.jsx";

const FeedBack = () => {
  const { t } = useTranslation();

  return (
    <TextBox data-testid="FeedBack">
      <span>{t(Strings.FeedBack.Request1)}</span>
      <span data-testid={"FeedBackLink"}>
        {t(Strings.FeedBack.Request2)}
        <StyledLink target={"_blank"} href={External.feedback}>
          {t(Strings.FeedBack.Link)}
        </StyledLink>
        {t(Strings.FeedBack.Request3)}
      </span>
    </TextBox>
  );
};

export default FeedBack;
