// For editing existing components

import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import HoldingPattern from "../holding-pattern/holding-pattern.component";
import ErrorHandler from "../error-handler/error-handler.component";
import ItemDetails from "./item-details.component";

import { AnalyticsActions } from "../../providers/analytics/analytics.actions";
import { AnalyticsContext } from "../../providers/analytics/analytics.provider";
import { ItemContext } from "../../providers/api/item/item.provider";
import { ShelfContext } from "../../providers/api/shelf/shelf.provider";
import { StoreContext } from "../../providers/api/store/store.provider";
import { TransactionContext } from "../../providers/api/transaction/transaction.provider";

import ApiActions from "../../providers/api/api.actions";
import ApiFuctions from "../../providers/api/api.functions";
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
  const { event } = React.useContext(AnalyticsContext);

  const [performItemAsync, setPerformItemAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions
  const [performShelfAsync, setPerformShelfAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions
  const [performStoreAsync, setPerformStoreAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions
  const [performTrAsync, setPerformTrAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions

  const [duplicate, setDuplicate] = React.useState(false);
  const [transaction, setTransaction] = React.useState(true);
  const [calculatedItem, setCalculatedItem] = React.useState(defaultItem);
  const [listTrComplete, setTrComplete] = React.useState(testHook);

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
    const search = item.inventory.find((i) => i.id === parseInt(itemId));
    if (search) return setCalculatedItem(search);
  }, [item]); // eslint-disable-line

  React.useEffect(() => {
    if (!performItemAsync) return;
    itemDispatch(performItemAsync);
    if (performItemAsync.type === ApiActions.FailureAuth) handleExpiredAuth();
    if (performItemAsync.type === ApiActions.SuccessDel) {
      history.goBack();
    }
    if (performItemAsync.type === ApiActions.DuplicateObject)
      setDuplicate(true);
    setPerformItemAsync(null);
  }, [performItemAsync]); // eslint-disable-line

  React.useEffect(() => {
    if (!performShelfAsync) return;
    if (performShelfAsync.type === ApiActions.FailureAuth) handleExpiredAuth();
    shelfDispatch(performShelfAsync);
    setPerformShelfAsync(null);
  }, [performShelfAsync]); // eslint-disable-line

  React.useEffect(() => {}, []);

  React.useEffect(() => {
    if (!performStoreAsync) return;
    if (performStoreAsync.type === ApiActions.FailureAuth) handleExpiredAuth();
    storeDispatch(performStoreAsync);
    setPerformStoreAsync(null);
  }, [performStoreAsync]); // eslint-disable-line

  React.useEffect(() => {
    if (!performTrAsync) return;
    if (performTrAsync.type === ApiActions.FailureAuth) handleExpiredAuth();
    if (performTrAsync.type === ApiActions.SuccessList) setTrComplete(true);
    trDispatch(performTrAsync);
    setPerformTrAsync(null);
  }, [performTrAsync]); // eslint-disable-line

  React.useEffect(() => {
    // Item
    setPerformItemAsync({
      type: ApiActions.StartGet,
      func: ApiFuctions.asyncGet,
      dispatch: setPerformItemAsync,
      payload: { id: itemId },
    });

    // Store;
    setPerformStoreAsync({
      type: ApiActions.StartList,
      func: ApiFuctions.asyncList,
      dispatch: setPerformStoreAsync,
      fetchAll: 1,
    });

    // Shelf
    setPerformShelfAsync({
      type: ApiActions.StartList,
      func: ApiFuctions.asyncList,
      dispatch: setPerformShelfAsync,
      fetchAll: 1,
    });
  }, []); // eslint-disable-line

  const handleTransactionRequest = () => {
    if (listTrComplete) return;
    setPerformTrAsync({
      type: ApiActions.StartList,
      func: ApiFuctions.asyncList,
      dispatch: setPerformTrAsync,
      payload: { id: parseInt(itemId) },
    });
  };

  const handleSave = (newItem) => {
    if (
      JSON.stringify(newItem) !==
      JSON.stringify(item.inventory.find((o) => o.id === parseInt(itemId)))
    ) {
      event(AnalyticsActions.ItemModified);
      setPerformItemAsync({
        type: ApiActions.StartUpdate,
        func: ApiFuctions.asyncUpdate,
        dispatch: setPerformItemAsync,
        payload: { ...newItem },
      });
    }
  };

  const handleDelete = (newItem) => {
    event(AnalyticsActions.ItemDeleted);
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
      messageTranslationKey={"ItemDetails.ApiError"}
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
          trStatus={listTrComplete}
          handleSave={handleSave}
          handleDelete={handleDelete}
          requestTransactions={handleTransactionRequest}
          duplicate={duplicate}
          setDuplicate={setDuplicate}
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
