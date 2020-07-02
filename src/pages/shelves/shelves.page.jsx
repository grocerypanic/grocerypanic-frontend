import React from "react";

import SimpleList from "../../components/simple-list/simple-list.component";

import { ShelfContext } from "../../providers/api/shelf/shelf.provider";
import { UserContext } from "../../providers/user/user.provider";
import { authExpired } from "../../providers/user/user.async";

import { useTranslation } from "react-i18next";

const ShelvesPage = () => {
  const { t } = useTranslation();
  const { dispatch } = React.useContext(UserContext);

  const [performAsync, setPerformAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions

  React.useEffect(() => {
    if (!performAsync) return;
    dispatch(performAsync);
    setPerformAsync(null);
  }, [performAsync]);

  const handleExpiredAuth = () => {
    authExpired(setPerformAsync);
  };

  return (
    <SimpleList
      title={t("ShelfPage.Title")}
      headerTitle={t("ShelfPage.HeaderTitle")}
      ApiObjectContext={ShelfContext}
      placeHolderMessage={t("ShelfPage.PlaceHolderMessage")}
      handleExpiredAuth={handleExpiredAuth}
      helpText={t("ShelfPage.HelpText")}
      redirectTag={"shelf"}
    />
  );
};

export default ShelvesPage;
