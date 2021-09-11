import React from "react";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import ItemDetailsEditContainer from "../../components/item-details/item-details.edit.container";
import { ItemContext } from "../../providers/api/item/item.provider";
import { authExpired } from "../../providers/social/social.async";
import { SocialContext } from "../../providers/social/social.provider";

const ItemDetailsPage = ({ match }) => {
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
    <ItemDetailsEditContainer
      itemId={match.params.id}
      title={t("ItemDetails.Title")}
      headerTitle={t("ItemDetails.HeaderTitle")}
      ApiObjectContext={ItemContext}
      handleExpiredAuth={handleExpiredAuth}
      helpText={t("ItemDetails.HelpText")}
    />
  );
};

export default withRouter(ItemDetailsPage);
