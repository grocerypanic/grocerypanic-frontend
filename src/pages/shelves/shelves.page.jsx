import React from "react";

import SimpleList from "../../components/simple-list/simple-list.component";

import { ShelfContext } from "../../providers/api/shelf/shelf.provider";
import { SocialContext } from "../../providers/social/social.provider";
import { authExpired } from "../../providers/social/social.async";

import { useTranslation } from "react-i18next";

const ShelvesPage = () => {
  const { t } = useTranslation();
  const { dispatch } = React.useContext(SocialContext);

  const [performAsync, setPerformAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions

  React.useEffect(() => {
    if (!performAsync) return;
    dispatch(performAsync);
    setPerformAsync(null);
  }, [performAsync]); // eslint-disable-line

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
