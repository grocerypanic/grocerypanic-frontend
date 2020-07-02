import React from "react";
import { useTranslation } from "react-i18next";

import Routes from "../../configuration/routes";

import { CopyrightBox, StyledLink } from "./copyright.styles.jsx";

const Copyright = () => {
  const { t } = useTranslation();
  const year = new Date(Date.now()).getFullYear();

  return (
    <CopyrightBox data-testid="CopyRight">
      {t("Copyight.CopyrightDeclaration")}
      <StyledLink to={Routes.root}>{t("Copyight.CopyrightMessage")}</StyledLink>
      &nbsp;{`${year}.`}
    </CopyrightBox>
  );
};

export default Copyright;
