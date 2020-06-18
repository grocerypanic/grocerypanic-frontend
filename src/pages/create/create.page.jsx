import React from "react";

import { ItemContext } from "../../providers/api/item/item.provider";
import { UserContext } from "../../providers/user/user.provider";
import { authExpired } from "../../providers/user/user.async";

import ItemDetailsCreateContainer from "../../components/item-details-form/item-details.create.container";

import { useTranslation } from "react-i18next";
import Strings from "../../configuration/strings";

const ItemCreatePage = () => {
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
    <ItemDetailsCreateContainer
      title={t(Strings.ItemDetails.Title)}
      headerTitle={t(Strings.ItemDetails.HeaderTitle)}
      ApiObjectContext={ItemContext}
      handleExpiredAuth={handleExpiredAuth}
      helpText={t(Strings.ItemDetails.HelpText)}
    />
  );
};

export default ItemCreatePage;
