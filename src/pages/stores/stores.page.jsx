import React from "react";
import { useTranslation } from "react-i18next";
import SimpleList from "../../components/simple-list/simple-list.component";
import { StoreContext } from "../../providers/api/store/store.provider";
import { authExpired } from "../../providers/social/social.async";
import { SocialContext } from "../../providers/social/social.provider";

const StoresPage = () => {
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
      title={t("StorePage.Title")}
      headerTitle={t("StorePage.HeaderTitle")}
      ApiObjectContext={StoreContext}
      placeHolderMessage={t("StorePage.PlaceHolderMessage")}
      handleExpiredAuth={handleExpiredAuth}
      helpText={t("StorePage.HelpText")}
      redirectTag={"preferred_stores"}
    />
  );
};

export default StoresPage;
