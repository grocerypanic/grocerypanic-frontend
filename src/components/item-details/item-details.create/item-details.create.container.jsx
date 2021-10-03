import PropTypes from "prop-types";
import React from "react";
import { withRouter } from "react-router-dom";
import Routes from "../../../configuration/routes";
import { Container } from "../../../global-styles/containers";
import { AnalyticsActions } from "../../../providers/analytics/analytics.actions";
import { AnalyticsContext } from "../../../providers/analytics/analytics.provider";
import ApiActions from "../../../providers/api/api.actions";
import ApiFunctions from "../../../providers/api/api.functions";
import { ItemContext } from "../../../providers/api/item/item.provider";
import { ShelfContext } from "../../../providers/api/shelf/shelf.provider";
import { StoreContext } from "../../../providers/api/store/store.provider";
import { HeaderContext } from "../../../providers/header/header.provider";
import ErrorHandler from "../../error-handler/error-handler.component";
import HoldingPattern from "../../holding-pattern/holding-pattern.component";
import ItemDetailsForm from "../item-details.form/item-details.form.component";
import { calculateDefaults } from "../item-details.utils.jsx";

export const defaultItem = {
  name: "",
  preferred_stores: [],
  price: "",
  quantity: 0,
  shelf: null,
  shelf_life: 14,
};

const ItemDetailsCreateContainer = ({
  headerTitle,
  title,
  handleExpiredAuth,
  helpText,
  history,
}) => {
  const { apiObject: item, dispatch: itemDispatch } =
    React.useContext(ItemContext);
  const { apiObject: shelf, dispatch: shelfDispatch } =
    React.useContext(ShelfContext);
  const { apiObject: store, dispatch: storeDispatch } =
    React.useContext(StoreContext);
  const { event } = React.useContext(AnalyticsContext);
  const { updateHeader } = React.useContext(HeaderContext);

  const [performItemAsync, setPerformItemAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions
  const [performShelfAsync, setPerformShelfAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions
  const [performStoreAsync, setPerformStoreAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions

  const [transaction, setTransaction] = React.useState(true);
  const [defaults, setDefaults] = React.useState(defaultItem);
  const [duplicate, setDuplicate] = React.useState(false);

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
    itemDispatch(performItemAsync);
    if (performItemAsync.type === ApiActions.FailureAuth) handleExpiredAuth();
    if (performItemAsync.type === ApiActions.SuccessAdd) history.goBack();
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

  React.useEffect(() => {
    if (!performStoreAsync) return;
    if (performStoreAsync.type === ApiActions.FailureAuth) handleExpiredAuth();
    storeDispatch(performStoreAsync);
    setPerformStoreAsync(null);
  }, [performStoreAsync]); // eslint-disable-line

  // Set the first shelf by default
  React.useEffect(() => {
    if (shelf.inventory.length > 0 && store.inventory.length > 0) {
      const params = new URLSearchParams(window.location.search);
      setDefaults(
        calculateDefaults(params, defaultItem, shelf.inventory, store.inventory)
      );
    }
  }, [shelf, store]);

  React.useEffect(() => {
    setPerformShelfAsync({
      type: ApiActions.StartList,
      func: ApiFunctions.asyncList,
      dispatch: setPerformShelfAsync,
      callback: setReceivedShelves,
      fetchAll: 1,
    });
    setPerformStoreAsync({
      type: ApiActions.StartList,
      func: ApiFunctions.asyncList,
      dispatch: setPerformStoreAsync,
      callback: setReceivedStores,
      fetchAll: 1,
    });
  }, []);

  const handleSave = (newItem) => {
    event(AnalyticsActions.ItemCreated);
    setPerformItemAsync({
      type: ApiActions.StartAdd,
      func: ApiFunctions.asyncAdd,
      dispatch: setPerformItemAsync,
      payload: { ...newItem },
    });
  };

  const clearError = () => {
    if (item.fail) setPerformItemAsync({ type: ApiActions.ClearErrors });
    if (store.fail) setPerformStoreAsync({ type: ApiActions.ClearErrors });
    if (shelf.fail) setPerformShelfAsync({ type: ApiActions.ClearErrors });
  };

  const checkForNonReceivedContent = () => {
    /* istanbul ignore next */
    return !receivedStores.complete || !receivedShelves.complete;
  };

  return (
    <ErrorHandler
      condition={item.fail || store.fail || shelf.fail}
      clearError={clearError}
      eventMessage={AnalyticsActions.ApiError}
      messageTranslationKey={"ItemDetails.ApiCommunicationError"}
      redirect={Routes.goBack}
    >
      <HoldingPattern condition={checkForNonReceivedContent()}>
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
            duplicate={duplicate}
            setDuplicate={setDuplicate}
          />
        </Container>
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
