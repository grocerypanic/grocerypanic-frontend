// For creating new components

import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import Header from "../header/header.component";
import HoldingPattern from "../holding-pattern/holding-pattern.component";
import ErrorHandler from "../error-handler/error-handler.component";
import ItemDetailsForm from "./item-details.form";

import ApiActions from "../../providers/api/api.actions";
import ApiFuctions from "../../providers/api/api.functions";
import { AnalyticsActions } from "../../providers/analytics/analytics.actions";
import Strings from "../../configuration/strings";
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
  const [performItemAsync, setPerformItemAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions
  const [performShelfAsync, setPerformShelfAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions
  const [performStoreAsync, setPerformStoreAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions
  const [transaction, setTransaction] = React.useState(true);
  const [defaults, setDefaults] = React.useState(defaultItem);

  const [receivedShelves, setReceivedShelves] = React.useState(false);
  const [receivedStores, setReceivedStores] = React.useState(false);
  const [saveComplete, setSaveComplete] = React.useState(false);

  React.useEffect(() => {
    // Detect Transactions on Any API Plane
    setTransaction(item.transaction || shelf.transaction || store.transaction);
  }, [item, store, shelf]);

  React.useEffect(() => {
    if (!performItemAsync) return;
    if (performItemAsync.type === ApiActions.FailureAuth) handleExpiredAuth();
    itemDispatch(performItemAsync);
    setPerformItemAsync(null);
  }, [performItemAsync]);

  React.useEffect(() => {
    if (!performShelfAsync) return;
    if (performShelfAsync.type === ApiActions.FailureAuth) handleExpiredAuth();
    shelfDispatch(performShelfAsync);
    setPerformShelfAsync(null);
  }, [performShelfAsync]);

  React.useEffect(() => {
    if (!performStoreAsync) return;
    if (performStoreAsync.type === ApiActions.FailureAuth) handleExpiredAuth();
    storeDispatch(performStoreAsync);
    setPerformStoreAsync(null);
  }, [performStoreAsync]);

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
    setPerformItemAsync({
      type: ApiActions.StartAdd,
      func: ApiFuctions.asyncAdd,
      dispatch: setPerformItemAsync,
      payload: { ...newItem },
      callback: setSaveComplete,
    });
  };

  React.useEffect(() => {
    if (saveComplete) history.goBack();
  }, [saveComplete]);

  const clearError = () => {
    if (item.error) setPerformItemAsync({ type: ApiActions.ClearErrors });
    if (store.error) setPerformStoreAsync({ type: ApiActions.ClearErrors });
    if (shelf.error) setPerformShelfAsync({ type: ApiActions.ClearErrors });
  };

  const checkForNonReceivedContent = () => {
    /* istanbul ignore next */
    return !receivedStores || !receivedShelves;
  };

  return (
    <ErrorHandler
      condition={item.error || store.error || shelf.error}
      clearError={clearError}
      eventMessage={AnalyticsActions.ApiError}
      stringsRoot={Strings.ItemDetails}
      string={"ApiCommunicationError"}
      redirect={Routes.goBack}
    >
      <Header title={headerTitle} transaction={transaction} />
      <HoldingPattern condition={checkForNonReceivedContent()}>
        <ErrorHandler
          condition={!store.inventory.length || !shelf.inventory.length}
          clearError={() => {}}
          eventMessage={null}
          stringsRoot={Strings.ItemDetails}
          string={"NeedShelvesAndStores"}
          redirect={Routes.goBack}
        >
          <Container>
            <ItemDetailsForm
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
