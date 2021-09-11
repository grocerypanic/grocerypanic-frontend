import React from "react";
import { useTranslation } from "react-i18next";
import ItemDetailsCreateContainer from "../../components/item-details/item-details.create.container";
import { ItemContext } from "../../providers/api/item/item.provider";
import { authExpired } from "../../providers/social/social.async";
import { SocialContext } from "../../providers/social/social.provider";

const ItemCreatePage = () => {
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
    <ItemDetailsCreateContainer
      title={t("CreateItem.Title")}
      headerTitle={t("CreateItem.HeaderTitle")}
      ApiObjectContext={ItemContext}
      handleExpiredAuth={handleExpiredAuth}
      helpText={t("CreateItem.HelpText")}
    />
  );
};

export default ItemCreatePage;
