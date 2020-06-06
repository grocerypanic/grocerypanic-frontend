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
      title={t(Strings.MainMenu.Title)}
      headerTitle={t(Strings.MainMenu.HeaderTitle)}
      helpText={t(Strings.MainMenu.HelpText)}
    />
  );
};

export default MenuPage;
