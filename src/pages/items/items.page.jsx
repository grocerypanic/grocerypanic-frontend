import React from "react";

import ItemList from "../../components/item-list/item-list.component";

import { ItemContext } from "../../providers/api/item/item.provider";
import { SocialContext } from "../../providers/social/social.provider";
import { authExpired } from "../../providers/social/social.async";

import { useTranslation } from "react-i18next";

const ItemsPage = () => {
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
    <ItemList
      title={t("InventoryPage.Title")}
      headerTitle={t("InventoryPage.HeaderTitle")}
      ApiObjectContext={ItemContext}
      placeHolderMessage={t("InventoryPage.PlaceHolderMessage")}
      handleExpiredAuth={handleExpiredAuth}
      helpText={t("InventoryPage.HelpText")}
    />
  );
};

export default ItemsPage;
