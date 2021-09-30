// For editing existing components

import PropTypes from "prop-types";
import React from "react";
import { withRouter } from "react-router-dom";
import ItemDetails from "./item-details.component";
import Routes from "../../configuration/routes";
import { AnalyticsActions } from "../../providers/analytics/analytics.actions";
import { AnalyticsContext } from "../../providers/analytics/analytics.provider";
import { ActivityContext } from "../../providers/api/activity/activity.provider";
import ApiActions from "../../providers/api/api.actions";
import ApiFunctions from "../../providers/api/api.functions";
import { ItemContext } from "../../providers/api/item/item.provider";
import { ShelfContext } from "../../providers/api/shelf/shelf.provider";
import { StoreContext } from "../../providers/api/store/store.provider";
import ErrorHandler from "../error-handler/error-handler.component";
import HoldingPattern from "../holding-pattern/holding-pattern.component";

const defaultItem = {
  name: "",
  preferred_stores: [],
  price: "",
  quantity: 0,
  shelf: null,
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
  const { apiObject: activity, dispatch: activityDispatch } = React.useContext(
    ActivityContext
  );
  const { event } = React.useContext(AnalyticsContext);

  const [performItemAsync, setPerformItemAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions
  const [performShelfAsync, setPerformShelfAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions
  const [performStoreAsync, setPerformStoreAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions
  const [performActivityAsync, setPerformActivityAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions

  const [duplicate, setDuplicate] = React.useState(false);
  const [transaction, setTransaction] = React.useState(true);
  const [calculatedItem, setCalculatedItem] = React.useState(defaultItem);
  const [listActivityComplete, setActivityComplete] = React.useState(testHook);

  React.useEffect(() => {
    setTransaction(
      item.transaction ||
        shelf.transaction ||
        store.transaction ||
        activity.transaction
    );
  }, [item, store, shelf, activity]);

  React.useEffect(() => {
    if (item.fail) return;
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
    if (!performActivityAsync) return;
    if (performActivityAsync.type === ApiActions.FailureAuth)
      handleExpiredAuth();
    if (performActivityAsync.type === ApiActions.SuccessGet)
      setActivityComplete(true);
    activityDispatch(performActivityAsync);
    setPerformActivityAsync(null);
  }, [performActivityAsync]); // eslint-disable-line

  React.useEffect(() => {
    // Item
    setPerformItemAsync({
      type: ApiActions.StartGet,
      func: ApiFunctions.asyncGet,
      dispatch: setPerformItemAsync,
      payload: { id: itemId },
    });

    // Store;
    setPerformStoreAsync({
      type: ApiActions.StartList,
      func: ApiFunctions.asyncList,
      dispatch: setPerformStoreAsync,
      fetchAll: 1,
    });

    // Shelf
    setPerformShelfAsync({
      type: ApiActions.StartList,
      func: ApiFunctions.asyncList,
      dispatch: setPerformShelfAsync,
      fetchAll: 1,
    });
  }, []); // eslint-disable-line

  const handleActivityReportRequest = () => {
    if (listActivityComplete) return;
    setPerformActivityAsync({
      type: ApiActions.StartGet,
      func: ApiFunctions.asyncGet,
      dispatch: setPerformActivityAsync,
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
        func: ApiFunctions.asyncUpdate,
        dispatch: setPerformItemAsync,
        payload: { ...newItem },
      });
    }
  };

  const handleDelete = (newItem) => {
    event(AnalyticsActions.ItemDeleted);
    setPerformItemAsync({
      type: ApiActions.StartDel,
      func: ApiFunctions.asyncDel,
      dispatch: setPerformItemAsync,
      payload: { id: newItem.id },
    });
  };

  const clearError = () => {
    if (item.fail) setPerformItemAsync({ type: ApiActions.ClearErrors });
    if (store.fail) setPerformStoreAsync({ type: ApiActions.ClearErrors });
    if (shelf.fail) setPerformShelfAsync({ type: ApiActions.ClearErrors });
    if (activity.fail)
      setPerformActivityAsync({ type: ApiActions.ClearErrors });
  };

  return (
    <ErrorHandler
      condition={item.fail || store.fail || shelf.fail || activity.fail}
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
          activity={activity.inventory}
          activityStatus={activity.transaction}
          handleSave={handleSave}
          handleDelete={handleDelete}
          requestActivityReport={handleActivityReportRequest}
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
