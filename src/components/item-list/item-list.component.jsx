import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import Header from "../header/header.component";
import ItemListRow from "../item-list-row/item-list-row.component";
import Help from "../simple-list-help/simple-list-help.component";
import Alert from "../alert/alert.component";
import HoldingPattern from "../holding-pattern/holding-pattern.component";

import ApiActions from "../../providers/api/api.actions";
import ApiFuctions from "../../providers/api/api.functions";

import preventContext from "../../util/preventDefault";
import { calculateTitle } from "./item-list.util";

import { Paper, Container } from "../../global-styles/containers";
import { ListBox, Banner, PlaceHolderListItem } from "./item-list.styles";

const ItemList = ({
  headerTitle,
  title,
  ApiObjectContext,
  placeHolderMessage,
  handleExpiredAuth,
  helpText,
  history,
  waitForApi = true,
}) => {
  const { apiObject, dispatch } = React.useContext(ApiObjectContext);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [actionMsg, setActionMsg] = React.useState(null);
  const [performAsync, setPerformAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener("contextmenu", preventContext);
    return () => {
      window.removeEventListener("contextmenu", preventContext);
    };
  }, []);

  React.useEffect(() => {
    if (!performAsync) return;
    if (performAsync.type === ApiActions.FailureAuth) handleExpiredAuth();
    dispatch(performAsync);
    setPerformAsync(null);
  }, [performAsync]);

  React.useEffect(() => {
    const filter = new URLSearchParams(window.location.search);

    dispatch({
      type: ApiActions.StartList,
      func: ApiFuctions.asyncList,
      dispatch: setPerformAsync,
      filter: filter,
      callback: setReady,
    });
  }, []);

  const handleCreate = () => {
    if (apiObject.transaction) return;
    console.log("PUSH TO CREATE PAGE");
  };

  const handleReStock = async (item, quantity) => {
    if (apiObject.transaction) return;
    setPerformAsync({
      type: ApiActions.StartUpdate, // Should be a transaction
      func: ApiFuctions.asyncUpdate,
      dispatch: setPerformAsync,
      payload: {
        ...item,
        quantity: parseInt(item.quantity) + parseInt(quantity),
      },
    });
  };

  const handleConsume = (item, quantity) => {
    if (apiObject.transaction) return;
    setPerformAsync({
      type: ApiActions.StartUpdate, // Should be a transaction
      func: ApiFuctions.asyncUpdate,
      dispatch: setPerformAsync,
      payload: {
        ...item,
        quantity: parseInt(item.quantity) - parseInt(quantity),
      },
    });
  };

  // Bundle Up Props For List Items

  const listFunctions = {
    restock: handleReStock,
    consume: handleConsume,
    setErrorMsg,
    setActionMsg,
  };

  const listValues = {
    transaction: apiObject.transaction,
  };

  return (
    <>
      <Header
        title={headerTitle}
        transaction={apiObject.transaction}
        create={handleCreate}
      />
      <HoldingPattern condition={!ready && waitForApi}>
        <Container>
          <Paper>
            {errorMsg ? (
              <Banner className="alert alert-danger">{errorMsg}</Banner>
            ) : (
              <Banner className="alert alert-success">
                {calculateTitle(title)}
              </Banner>
            )}
            <ListBox>
              {apiObject.inventory.map((item) => {
                return (
                  <ItemListRow
                    item={item}
                    allItems={apiObject.inventory}
                    key={item.id}
                    listFunctions={listFunctions}
                    listValues={listValues}
                    history={history}
                  />
                );
              })}
              {apiObject.inventory.length === 0 ? (
                <PlaceHolderListItem>{placeHolderMessage}</PlaceHolderListItem>
              ) : null}
            </ListBox>
          </Paper>
        </Container>
        <Alert message={actionMsg} />
        <Help>{helpText}</Help>
      </HoldingPattern>
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
