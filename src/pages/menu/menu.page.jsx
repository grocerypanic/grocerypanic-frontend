import React from "react";
import { useTranslation } from "react-i18next";
import Menu from "../../components/menu/menu.component";
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
