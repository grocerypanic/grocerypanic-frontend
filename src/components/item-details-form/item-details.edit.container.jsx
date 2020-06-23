// For editing existing components

import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import HoldingPattern from "../holding-pattern/holding-pattern.component";
import ErrorHandler from "../error-handler/error-handler.component";
import ItemDetails from "./item-details.component";

import { ItemContext } from "../../providers/api/item/item.provider";
import { ShelfContext } from "../../providers/api/shelf/shelf.provider";
import { StoreContext } from "../../providers/api/store/store.provider";
import { TransactionContext } from "../../providers/api/transaction/transaction.provider";

import ApiActions from "../../providers/api/api.actions";
import ApiFuctions from "../../providers/api/api.functions";
import { AnalyticsActions } from "../../providers/analytics/analytics.actions";
import Strings from "../../configuration/strings";
import Routes from "../../configuration/routes";

const defaultItem = {
  name: "",
  preferred_stores: [],
  price: "",
  quantity: 0,
  shelf: "",
  shelf_life: 14,
};

const ItemDetailsEditContainer = ({
  itemId,
  headerTitle,
  title,
  handleExpiredAuth,
  helpText,
  history,
  testHook = false,
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
  const { apiObject: tr, dispatch: trDispatch } = React.useContext(
    TransactionContext
  );

  const [performItemAsync, setPerformItemAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions
  const [performShelfAsync, setPerformShelfAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions
  const [performStoreAsync, setPerformStoreAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions
  const [performTrAsync, setPerformTrAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions

  const [transaction, setTransaction] = React.useState(true);

  const [calculatedItem, setCalculatedItem] = React.useState(defaultItem);
  const [listItemsComplete, setListItemsComplete] = React.useState(testHook);

  React.useEffect(() => {
    // Detect Transactions on Any API Plane (except transactions, which is handled at a lower layer)
    setTransaction(
      item.transaction ||
        shelf.transaction ||
        store.transaction ||
        tr.transaction
    );
  }, [item, store, shelf, tr]);

  React.useEffect(() => {
    if (item.error) return;
    if (item.inventory.length > 0) {
      const search = item.inventory.find((i) => i.id === parseInt(itemId));
      if (search) return setCalculatedItem(search);
    }
    if (listItemsComplete) {
      itemDispatch({
        type: ApiActions.FailureGet,
      });
    }
  }, [item]);

  React.useEffect(() => {
    if (!performItemAsync) return;
    if (performItemAsync.type === ApiActions.FailureAuth) handleExpiredAuth();
    if (performItemAsync.type === ApiActions.SuccessList)
      performItemAsync.callback = setListItemsComplete;
    if (performItemAsync.type === ApiActions.SuccessDel) {
      setListItemsComplete(false);
      history.goBack();
    }
    itemDispatch(performItemAsync);
    setPerformItemAsync(null);
  }, [performItemAsync]);

  React.useEffect(() => {
    if (!performShelfAsync) return;
    if (performShelfAsync.type === ApiActions.FailureAuth) handleExpiredAuth();
    shelfDispatch(performShelfAsync);
    setPerformShelfAsync(null);
  }, [performShelfAsync]);

  React.useEffect(() => {}, []);

  React.useEffect(() => {
    if (!performStoreAsync) return;
    if (performStoreAsync.type === ApiActions.FailureAuth) handleExpiredAuth();
    storeDispatch(performStoreAsync);
    setPerformStoreAsync(null);
  }, [performStoreAsync]);

  React.useEffect(() => {
    if (!performTrAsync) return;
    if (performTrAsync.type === ApiActions.FailureAuth) handleExpiredAuth();
    trDispatch(performTrAsync);
    setPerformTrAsync(null);
  }, [performTrAsync]);

  React.useEffect(() => {
    setPerformItemAsync({
      type: ApiActions.StartList,
      func: ApiFuctions.asyncList,
      dispatch: setPerformItemAsync,
    });
    setPerformStoreAsync({
      type: ApiActions.StartList,
      func: ApiFuctions.asyncList,
      dispatch: setPerformStoreAsync,
    });
    setPerformShelfAsync({
      type: ApiActions.StartList,
      func: ApiFuctions.asyncList,
      dispatch: setPerformShelfAsync,
    });
  }, []);

  const handleTransactionRequest = () => {
    setPerformTrAsync({
      type: ApiActions.StartList,
      func: ApiFuctions.asyncList,
      dispatch: setPerformTrAsync,
      payload: { id: parseInt(itemId) },
    });
  };

  const handleSave = (newItem) => {
    setPerformItemAsync({
      type: ApiActions.StartUpdate,
      func: ApiFuctions.asyncUpdate,
      dispatch: setPerformItemAsync,
      payload: { ...newItem },
    });
  };

  const handleDelete = (newItem) => {
    setPerformItemAsync({
      type: ApiActions.StartDel,
      func: ApiFuctions.asyncDel,
      dispatch: setPerformItemAsync,
      payload: { id: newItem.id },
    });
  };

  const clearError = () => {
    if (item.error) setPerformItemAsync({ type: ApiActions.ClearErrors });
    if (store.error) setPerformStoreAsync({ type: ApiActions.ClearErrors });
    if (shelf.error) setPerformShelfAsync({ type: ApiActions.ClearErrors });
    if (tr.error) setPerformTrAsync({ type: ApiActions.ClearErrors });
  };

  return (
    <ErrorHandler
      condition={item.error || store.error || shelf.error || tr.error}
      clearError={clearError}
      eventMessage={AnalyticsActions.ApiError}
      stringsRoot={Strings.ItemDetails}
      string={"ApiError"}
      redirect={Routes.goBack}
    >
      <HoldingPattern condition={calculatedItem === defaultItem}>
        <ItemDetails
          allItems={item.inventory}
          item={calculatedItem}
          headerTitle={headerTitle}
          title={title}
          helpText={helpText}
          transaction={transaction}
          stores={store.inventory}
          shelves={shelf.inventory}
          tr={tr.inventory}
          handleSave={handleSave}
          handleDelete={handleDelete}
          requestTransactions={handleTransactionRequest}
        />
      </HoldingPattern>
    </ErrorHandler>
  );
};

export default withRouter(ItemDetailsEditContainer);

ItemDetailsEditContainer.propTypes = {
  itemId: PropTypes.string.isRequired,
  headerTitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  handleExpiredAuth: PropTypes.func.isRequired,
  helpText: PropTypes.string.isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
