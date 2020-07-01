import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import ErrorHandler from "../error-handler/error-handler.component";
import ItemListRow from "../item-list-row/item-list-row.component";
import Hint from "../hint/hint.component";
import Alert from "../alert/alert.component";
import HoldingPattern from "../holding-pattern/holding-pattern.component";

import { HeaderContext } from "../../providers/header/header.provider";
import { ItemContext } from "../../providers/api/item/item.provider";
import { TransactionContext } from "../../providers/api/transaction/transaction.provider";
import { AnalyticsContext } from "../../providers/analytics/analytics.provider";
import { AnalyticsActions } from "../../providers/analytics/analytics.actions";

import ApiActions from "../../providers/api/api.actions";
import ApiFuctions from "../../providers/api/api.functions";
import Strings from "../../configuration/strings";
import Routes from "../../configuration/routes";

import preventContext from "../../util/preventDefault";
import calculateMaxHeight from "../../util/height";

import { calculateTitle } from "./item-list.util";

import { Paper, Container } from "../../global-styles/containers";
import { ItemizedBanner } from "../../global-styles/banner";
import { Scroller, ListBox, PlaceHolderListItem } from "./item-list.styles";

const ItemList = ({
  headerTitle,
  title,
  placeHolderMessage,
  handleExpiredAuth,
  helpText,
  history,
  waitForApi = true,
}) => {
  const { apiObject: item, dispatch: itemDispatch } = React.useContext(
    ItemContext
  );
  const {
    apiObject: transaction,
    dispatch: transactionDispatch,
  } = React.useContext(TransactionContext);
  const { event } = React.useContext(AnalyticsContext);
  const { updateHeader } = React.useContext(HeaderContext);

  const [errorMsg, setErrorMsg] = React.useState(null);
  const [actionMsg, setActionMsg] = React.useState(null);

  const [performItemAsync, setPerformItemAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions
  const [performTransactionAsync, setPerformTransactionAsync] = React.useState(
    null
  ); // Handles dispatches without duplicating reducer actions

  const [ready, setReady] = React.useState(false);
  const [listSize, setListSize] = React.useState(calculateMaxHeight());

  const transactionStatus = () => item.transaction || transaction.transaction;
  const recalculateHeight = () => setListSize(calculateMaxHeight());

  React.useEffect(() => {
    window.addEventListener("resize", recalculateHeight);
    window.addEventListener("contextmenu", preventContext);
    return () => {
      window.removeEventListener("resize", recalculateHeight);
      window.removeEventListener("contextmenu", preventContext);
    };
  }, []);

  React.useEffect(() => {
    if (!performItemAsync) return;
    if (performItemAsync.type === ApiActions.FailureAuth) handleExpiredAuth();
    if (performItemAsync.type === ApiActions.SuccessList) setReady(true);
    itemDispatch(performItemAsync);
    setPerformItemAsync(null);
  }, [performItemAsync]);

  React.useEffect(() => {
    if (!performTransactionAsync) return;
    if (performTransactionAsync.type === ApiActions.FailureAuth)
      handleExpiredAuth();
    transactionDispatch(performTransactionAsync);
    setPerformTransactionAsync(null);
  }, [performTransactionAsync]);

  // Ensure This Is Recalculated On Every Route Change
  React.useEffect(() => {
    const filter = new URLSearchParams(window.location.search);
    itemDispatch({
      type: ApiActions.StartList,
      func: ApiFuctions.asyncList,
      dispatch: setPerformItemAsync,
      filter: filter,
    });
  }, [history.location.key]);

  const handleCreate = () => {
    if (transactionStatus()) return;
    // TODO: is it possible to populate the shelf or store automatically based on current route?
    history.push(Routes.create);
  };

  const generateCallback = (itemToRefresh, quantity) => {
    const callback = (state) => {
      if (state.success && state.complete) {
        setPerformItemAsync({
          type: ApiActions.StartGet,
          func: ApiFuctions.asyncGet,
          dispatch: setPerformItemAsync,
          payload: {
            id: itemToRefresh.id,
          },
        });
        if (quantity > 0)
          new Promise((resolve) => event(AnalyticsActions.TransactionRestock));
        if (quantity < 0)
          new Promise((resolve) => event(AnalyticsActions.TransactionConsume));
      }
    };
    return callback;
  };

  const handleReStock = async (receivedItem, quantity) => {
    if (transactionStatus()) return;
    setPerformTransactionAsync({
      type: ApiActions.StartAdd,
      func: ApiFuctions.asyncAdd,
      dispatch: setPerformTransactionAsync,
      payload: {
        item: receivedItem.id,
        quantity: parseInt(quantity),
      },
      callback: generateCallback(receivedItem, parseInt(quantity)),
    });
  };

  const handleConsume = (receivedItem, quantity) => {
    if (transactionStatus()) return;
    setPerformTransactionAsync({
      type: ApiActions.StartAdd,
      func: ApiFuctions.asyncAdd,
      dispatch: setPerformTransactionAsync,
      payload: {
        item: receivedItem.id,
        quantity: parseInt(quantity) * -1,
      },
      callback: generateCallback(receivedItem, parseInt(quantity) * -1),
    });
  };

  React.useEffect(() => {
    updateHeader({
      title: headerTitle,
      create: handleCreate,
      transaction: transactionStatus(),
      disableNav: false,
    });
  }, [item.transaction, transaction.transaction]);

  // Bundle Up Props For List Items

  const listFunctions = {
    restock: handleReStock,
    consume: handleConsume,
    setErrorMsg,
    setActionMsg,
  };

  const clearError = () => {
    setPerformItemAsync({ type: ApiActions.ClearErrors });
  };

  return (
    <>
      <ErrorHandler
        condition={item.error || transaction.error}
        clearError={clearError}
        eventMessage={AnalyticsActions.ApiError}
        stringsRoot={Strings.ItemList}
        string={"ApiError"}
        redirect={Routes.goBack}
      >
        <HoldingPattern condition={!ready && waitForApi}>
          <Container>
            <Paper>
              {errorMsg ? (
                <ItemizedBanner className="alert alert-danger">
                  {errorMsg}
                </ItemizedBanner>
              ) : (
                <ItemizedBanner className="alert alert-success">
                  {calculateTitle(title)}
                </ItemizedBanner>
              )}
              <Scroller className="overflow-auto" size={listSize}>
                <ListBox>
                  {item.inventory.map((i) => {
                    return (
                      <ItemListRow
                        item={i}
                        allItems={item.inventory}
                        key={i.id}
                        listFunctions={listFunctions}
                        listValues={{ transaction: transactionStatus() }}
                        history={history}
                      />
                    );
                  })}
                  {item.inventory.length === 0 ? (
                    <PlaceHolderListItem>
                      {placeHolderMessage}
                    </PlaceHolderListItem>
                  ) : null}
                </ListBox>
              </Scroller>
            </Paper>
          </Container>
          <Alert message={actionMsg} />
          <Hint>{helpText}</Hint>
        </HoldingPattern>
      </ErrorHandler>
    </>
  );
};

export default withRouter(ItemList);

ItemList.propTypes = {
  headerTitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  ApiObjectContext: PropTypes.object.isRequired,
  placeHolderMessage: PropTypes.string.isRequired,
  handleExpiredAuth: PropTypes.func.isRequired,
  helpText: PropTypes.string.isRequired,
};
