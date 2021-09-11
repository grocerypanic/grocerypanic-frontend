import React from "react";
import { useTranslation } from "react-i18next";
import Dialogue from "../../components/dialogue/dialogue.component";
import Header from "../../components/header/header.component";
import { HeaderContext } from "../../providers/header/header.provider";

const MaintenancePage = () => {
  const { t } = useTranslation();
  const { updateHeader } = React.useContext(HeaderContext);

  React.useEffect(() => {
    updateHeader({
      title: "MainHeaderTitle",
      disableNav: true,
    });
  }, []); // eslint-disable-line

  return (
    <>
      <Header />
      <Dialogue
        title={t("Maintenance.Title")}
        headerTitle={t("Maintenance.HeaderTitle")}
        body={t("Maintenance.Body")}
        Footer={() => <div></div>}
      />
    </>
  );
};

export default MaintenancePage;
