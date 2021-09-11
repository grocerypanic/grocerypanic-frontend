import React from "react";
import { useTranslation } from "react-i18next";
import ItemList from "../../components/item-list/item-list.component";
import { ItemContext } from "../../providers/api/item/item.provider";
import { authExpired } from "../../providers/social/social.async";
import { SocialContext } from "../../providers/social/social.provider";

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
