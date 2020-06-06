import React from "react";
import { useTranslation } from "react-i18next";

import Strings from "../../configuration/strings";
import Routes from "../../configuration/routes";

import { CopyrightBox, StyledLink } from "./copyright.styles.jsx";

const Copyright = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <CopyrightBox data-testid="CopyRight">
      {t(Strings.Copyight.CopyrightDeclaration)}
      <StyledLink to={Routes.root}>
        {t(Strings.Copyight.CopyrightMessage)}
      </StyledLink>
      &nbsp;{`${year}.`}
    </CopyrightBox>
  );
};

export default Copyright;
