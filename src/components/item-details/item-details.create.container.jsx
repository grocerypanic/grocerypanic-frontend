// For creating new components

import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import HoldingPattern from "../holding-pattern/holding-pattern.component";
import ErrorHandler from "../error-handler/error-handler.component";
import ItemDetailsForm from "../item-details-form/item-details-form.component";
import { HeaderContext } from "../../providers/header/header.provider";

import ApiActions from "../../providers/api/api.actions";
import ApiFuctions from "../../providers/api/api.functions";

import { AnalyticsActions } from "../../providers/analytics/analytics.actions";
import { AnalyticsContext } from "../../providers/analytics/analytics.provider";

import Routes from "../../configuration/routes";

import { ItemContext } from "../../providers/api/item/item.provider";
import { ShelfContext } from "../../providers/api/shelf/shelf.provider";
import { StoreContext } from "../../providers/api/store/store.provider";

import { Container } from "../../global-styles/containers";

export const defaultItem = {
  name: "",
  preferred_stores: [],
  price: "",
  quantity: 0,
  shelf: "",
  shelf_life: 14,
};

const ItemDetailsCreateContainer = ({
  headerTitle,
  title,
  handleExpiredAuth,
  helpText,
  history,
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
  const { event } = React.useContext(AnalyticsContext);
  const { updateHeader } = React.useContext(HeaderContext);

  const [performItemAsync, setPerformItemAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions
  const [performShelfAsync, setPerformShelfAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions
  const [performStoreAsync, setPerformStoreAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions

  const [transaction, setTransaction] = React.useState(true);
  const [defaults, setDefaults] = React.useState(defaultItem);

  const callBackState = { success: false, complete: false };
  const [receivedShelves, setReceivedShelves] = React.useState(callBackState);
  const [receivedStores, setReceivedStores] = React.useState(callBackState);

  React.useEffect(() => {
    // Detect Transactions on Any API Plane
    setTransaction(item.transaction || shelf.transaction || store.transaction);
  }, [item, store, shelf]);

  React.useEffect(() => {
    updateHeader({
      title: headerTitle,
      create: null,
      transaction: transaction,
      disableNav: false,
    });
  }, [transaction]); // eslint-disable-line

  React.useEffect(() => {
    if (!performItemAsync) return;
    if (performItemAsync.type === ApiActions.FailureAuth) handleExpiredAuth();
    if (performItemAsync.type === ApiActions.SuccessAdd) history.goBack();
    itemDispatch(performItemAsync);
    setPerformItemAsync(null);
  }, [performItemAsync]); // eslint-disable-line

  React.useEffect(() => {
    if (!performShelfAsync) return;
    if (performShelfAsync.type === ApiActions.FailureAuth) handleExpiredAuth();
    shelfDispatch(performShelfAsync);
    setPerformShelfAsync(null);
  }, [performShelfAsync]); // eslint-disable-line

  React.useEffect(() => {
    if (!performStoreAsync) return;
    if (performStoreAsync.type === ApiActions.FailureAuth) handleExpiredAuth();
    storeDispatch(performStoreAsync);
    setPerformStoreAsync(null);
  }, [performStoreAsync]); // eslint-disable-line

  // Set the first shelf by default
  React.useEffect(() => {
    if (shelf.inventory.length > 0)
      setDefaults({ ...defaultItem, shelf: shelf.inventory[0].id });
  }, [shelf]);

  React.useEffect(() => {
    setPerformShelfAsync({
      type: ApiActions.StartList,
      func: ApiFuctions.asyncList,
      dispatch: setPerformShelfAsync,
      callback: setReceivedShelves,
    });
    setPerformStoreAsync({
      type: ApiActions.StartList,
      func: ApiFuctions.asyncList,
      dispatch: setPerformStoreAsync,
      callback: setReceivedStores,
    });
  }, []);

  const handleSave = (newItem) => {
    event(AnalyticsActions.ItemCreated);
    setPerformItemAsync({
      type: ApiActions.StartAdd,
      func: ApiFuctions.asyncAdd,
      dispatch: setPerformItemAsync,
      payload: { ...newItem },
    });
  };

  const clearError = () => {
    if (item.error) setPerformItemAsync({ type: ApiActions.ClearErrors });
    if (store.error) setPerformStoreAsync({ type: ApiActions.ClearErrors });
    if (shelf.error) setPerformShelfAsync({ type: ApiActions.ClearErrors });
  };

  const checkForNonReceivedContent = () => {
    /* istanbul ignore next */
    return !receivedStores.complete || !receivedShelves.complete;
  };

  return (
    <ErrorHandler
      condition={item.error || store.error || shelf.error}
      clearError={clearError}
      eventMessage={AnalyticsActions.ApiError}
      messageTranslationKey={"ItemDetails.ApiCommunicationError"}
      redirect={Routes.goBack}
    >
      <HoldingPattern condition={checkForNonReceivedContent()}>
        <ErrorHandler
          condition={!store.inventory.length || !shelf.inventory.length}
          clearError={() => {}}
          eventMessage={null}
          messageTranslationKey={"ItemDetails.NeedShelvesAndStores"}
          redirect={Routes.goBack}
        >
          <Container>
            <ItemDetailsForm
              allItems={item.inventory}
              item={defaults}
              title={title}
              helpText={helpText}
              transaction={transaction}
              stores={store.inventory}
              shelves={shelf.inventory}
              handleSave={handleSave}
            />
          </Container>
        </ErrorHandler>
      </HoldingPattern>
    </ErrorHandler>
  );
};

export default withRouter(ItemDetailsCreateContainer);

ItemDetailsCreateContainer.propTypes = {
  headerTitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  handleExpiredAuth: PropTypes.func.isRequired,
  helpText: PropTypes.string.isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
