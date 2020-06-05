import React from "react";

// import ItemList from "../../components/item-details/item-details.component";

import { StoreContext } from "../../providers/api/store/store.provider";
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

  return <div>ItemList</div>;
};

export default ItemsPage;
