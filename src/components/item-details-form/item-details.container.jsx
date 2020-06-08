// For editing existing components, then will add create functionality

import React from "react";
import PropTypes from "prop-types";

import ItemDetails from "./item-details.form";

import ApiActions from "../../providers/api/api.actions";
import ApiFuctions from "../../providers/api/api.functions";

import { ItemContext } from "../../providers/api/item/item.provider";
import { ShelfContext } from "../../providers/api/shelf/shelf.provider";
import { StoreContext } from "../../providers/api/store/store.provider";

const defaultItem = {
  name: "",
  preferred_stores: [],
  price: "",
  quantity: 0,
  shelf: "",
  shelf_life: 14,
};

const ItemDetailsContainer = ({
  itemId,
  headerTitle,
  title,
  handleExpiredAuth,
  helpText,
}) => {
  const { apiObject: item, dispatch: itemDispatch } = React.useContext(
    ItemContext
  );
  const { apiObject: shelf, dispatch: shelfDispatch } = React.useContext(
    ShelfContext
  );
  const { apiObject: store, dispatch: storeDispatch } = React.useContext(
    StoreContext
  );
  const [performItemAsync, setPerformItemAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions
  const [performShelfAsync, setPerformShelfAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions
  const [performStoreAsync, setPerformStoreAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions

  const [transaction, setTransaction] = React.useState(true);
  const [calculatedItem, setCalculatedItem] = React.useState(defaultItem);

  React.useEffect(() => {
    // Detect Transactions on Any API Plane
    setTransaction(item.transaction || shelf.transaction || store.transaction);
  }, [item, store, shelf]);

  React.useEffect(() => {
    let thisItem;
    if (item.inventory.length > 0) {
      thisItem = item.inventory.find((i) => i.id === parseInt(itemId));
    }
    if (!thisItem) thisItem = defaultItem;
    setCalculatedItem(thisItem);
  }, [item]);

  React.useEffect(() => {
    if (!performItemAsync) return;
    if (performItemAsync.type === ApiActions.FailureAuth) handleExpiredAuth();
    itemDispatch(performItemAsync);
    setPerformItemAsync(null);
  }, [performItemAsync]);

  React.useEffect(() => {
    setPerformItemAsync({
      type: ApiActions.StartGet,
      func: ApiFuctions.asyncGet,
      dispatch: setPerformItemAsync,
      payload: { id: itemId },
    });
  }, []);

  React.useEffect(() => {
    if (!performShelfAsync) return;
    if (performShelfAsync.type === ApiActions.FailureAuth) handleExpiredAuth();
    shelfDispatch(performShelfAsync);
    setPerformShelfAsync(null);
  }, [performShelfAsync]);

  React.useEffect(() => {
    setPerformShelfAsync({
      type: ApiActions.StartList,
      func: ApiFuctions.asyncList,
      dispatch: setPerformShelfAsync,
    });
  }, []);

  React.useEffect(() => {
    if (!performStoreAsync) return;
    if (performStoreAsync.type === ApiActions.FailureAuth) handleExpiredAuth();
    storeDispatch(performStoreAsync);
    setPerformStoreAsync(null);
  }, [performStoreAsync]);

  React.useEffect(() => {
    setPerformStoreAsync({
      type: ApiActions.StartList,
      func: ApiFuctions.asyncList,
      dispatch: setPerformStoreAsync,
    });
  }, []);

  const handleSave = (newItem) => {
    console.log(newItem);
  };

  // Prevents rendering too early and is a place to catch fetch errors
  if (calculatedItem === defaultItem) return <div>Waiting....</div>;

  return (
    <ItemDetails
      item={calculatedItem}
      headerTitle={headerTitle}
      title={title}
      helpText={helpText}
      transaction={transaction}
      stores={store.inventory}
      shelves={shelf.inventory}
      handleSave={handleSave}
    />
  );
};

export default ItemDetailsContainer;

ItemDetailsContainer.propTypes = {
  itemId: PropTypes.string.isRequired,
  headerTitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  handleExpiredAuth: PropTypes.func.isRequired,
  helpText: PropTypes.string.isRequired,
};
