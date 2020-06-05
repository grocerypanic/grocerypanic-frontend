import React from "react";

import Menu from "../../components/menu/menu.component";

import { useTranslation } from "react-i18next";
import Strings from "../../configuration/strings";
import Options from "../../configuration/menu";

const MenuPage = () => {
  const { t } = useTranslation();

  return (
    <Menu
      options={Options}
      title={t(Strings.MainMenuPageTitle)}
      headerTitle={t(Strings.MainMenuPageHeaderTitle)}
      helpText={t(Strings.MainMenuHelpText)}
    />
  );
};

export default MenuPage;
