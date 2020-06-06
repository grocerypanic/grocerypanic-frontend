import React from "react";

import SimpleList from "../../components/simple-list/simple-list.component";

import { StoreContext } from "../../providers/api/store/store.provider";
import { UserContext } from "../../providers/user/user.provider";
import { authExpired } from "../../providers/user/user.async";

import { useTranslation } from "react-i18next";
import Strings from "../../configuration/strings";

const StoresPage = () => {
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
      title={t(Strings.StorePage.Title)}
      headerTitle={t(Strings.StorePage.HeaderTitle)}
      ApiObjectContext={StoreContext}
      placeHolderMessage={t(Strings.StorePage.PlaceHolderMessage)}
      handleExpiredAuth={handleExpiredAuth}
      helpText={t(Strings.StorePage.HelpText)}
    />
  );
};

export default StoresPage;
