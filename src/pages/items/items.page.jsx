import React from "react";

import ItemList from "../../components/item-list/item-list.component";

import { ItemContext } from "../../providers/api/item/item.provider";
import { UserContext } from "../../providers/user/user.provider";
import { authExpired } from "../../providers/user/user.async";

import { useTranslation } from "react-i18next";
import Strings from "../../configuration/strings";

const ItemsPage = () => {
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
    <ItemList
      title={t(Strings.InventoryPage.Title)}
      headerTitle={t(Strings.InventoryPage.HeaderTitle)}
      ApiObjectContext={ItemContext}
      placeHolderMessage={t(Strings.InventoryPage.PlaceHolderMessage)}
      handleExpiredAuth={handleExpiredAuth}
      helpText={t(Strings.InventoryPage.HelpText)}
    />
  );
};

export default ItemsPage;
