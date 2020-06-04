import React from "react";

import Header from "../header/header.component";
import SimpleListItem from "../simple-list-item/simple-list-item.component";
import Help from "../simple-list-help/simple-list-help.component";

import ApiActions from "../../providers/api/api.actions";
import ApiFuctions from "../../providers/api/api.functions";

import { Paper, Container } from "../../global-styles/containers";
import { ListBox, Banner, PlaceHolderListItem } from "./simple-list.styles";

const SimpleList = ({
  headerTitle,
  title,
  ApiObjectContext,
  placeHolderMessage,
  handleExpiredAuth,
  helpText,
}) => {
  const { apiObject, dispatch } = React.useContext(ApiObjectContext);
  const [selected, setSelected] = React.useState(null);
  const [created, setCreated] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [longPress, setLongPress] = React.useState(false);

  const [performAsync, setPerformAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions

  React.useEffect(() => {
    if (!performAsync) return;
    if (performAsync.type === ApiActions.FailureAuth) handleExpiredAuth();
    dispatch(performAsync);
    setPerformAsync(null);
  }, [performAsync]);

  React.useEffect(() => {
    dispatch({
      type: ApiActions.StartList,
      func: ApiFuctions.asyncList,
      dispatch: setPerformAsync,
    });
  }, []);

  const handleCreate = () => {
    if (apiObject.transaction) return;
    setCreated({ id: -1, name: "" });
    setSelected(-1);
  };

  const handleSave = async (name) => {
    if (apiObject.transaction) return;
    setPerformAsync({
      type: ApiActions.StartAdd,
      func: ApiFuctions.asyncAdd,
      dispatch: setPerformAsync,
      payload: { name },
    });
    setCreated(null);
  };

  const handleDelete = (id) => {
    if (apiObject.transaction) return;
    setPerformAsync({
      type: ApiActions.StartDel,
      func: ApiFuctions.asyncDel,
      dispatch: setPerformAsync,
      payload: { id },
    });
  };

  // Bundle Up Props For List Items

  const listFunctions = {
    add: handleSave,
    del: handleDelete,
    setSelected,
    setErrorMsg,
    setCreated,
    setLongPress,
  };

  const listValues = {
    selected,
    errorMsg,
    transaction: apiObject.transaction,
    longPress,
  };

  return (
    <>
      <Header
        title={headerTitle}
        transaction={apiObject.transaction}
        create={handleCreate}
      />
      <Container>
        <Paper>
          {errorMsg && created ? (
            <Banner className="alert alert-danger">{errorMsg}</Banner>
          ) : (
            <Banner className="alert alert-success">{title}</Banner>
          )}
          <ListBox>
            {apiObject.inventory.map((item) => {
              return (
                <SimpleListItem
                  item={item}
                  allItems={apiObject.inventory}
                  key={item.id}
                  listFunctions={listFunctions}
                  listValues={listValues}
                />
              );
            })}
            {created ? (
              <SimpleListItem
                item={created}
                allItems={apiObject.inventory}
                listFunctions={listFunctions}
                listValues={listValues}
              />
            ) : null}
            {apiObject.inventory.length === 0 && !created ? (
              <PlaceHolderListItem>{placeHolderMessage}</PlaceHolderListItem>
            ) : null}
          </ListBox>
        </Paper>
      </Container>
      <Help>{helpText}</Help>
    </>
  );
};

export default SimpleList;
