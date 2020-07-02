import React from "react";

import Menu from "../../components/menu/menu.component";

import { useTranslation } from "react-i18next";
import Options from "../../configuration/menu";

const MenuPage = () => {
  const { t } = useTranslation();

  return (
    <Menu
      options={Options}
      title={t("MainMenu.Title")}
      headerTitle={t("MainMenu.HeaderTitle")}
      helpText={t("MainMenu.HelpText")}
    />
  );
};

export default MenuPage;
