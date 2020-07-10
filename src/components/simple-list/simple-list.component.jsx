import React from "react";
import PropTypes from "prop-types";

import {
  AnalyticsActions,
  IndexedAnalyticsActions,
} from "../../providers/analytics/analytics.actions";
import { AnalyticsContext } from "../../providers/analytics/analytics.provider";
import { HeaderContext } from "../../providers/header/header.provider";

import ErrorHandler from "../error-handler/error-handler.component";
import SimpleListItem from "../simple-list-item/simple-list-item.component";
import Hint from "../hint/hint.component";
import Alert from "../alert/alert.component";
import Pagination from "../pagination/pagination.component";
import HoldingPattern from "../holding-pattern/holding-pattern.component";

import Routes from "../../configuration/routes";
import { Constants } from "../../configuration/backend";

import ApiActions from "../../providers/api/api.actions";
import ApiFuctions from "../../providers/api/api.functions";

import { Paper, Container } from "../../global-styles/containers";
import { ItemizedBanner } from "../../global-styles/banner";
import { Scroller, ListBox, PlaceHolderListItem } from "./simple-list.styles";

import preventContext from "../../util/preventDefault";
import calculateMaxHeight from "../../util/height";

const SimpleList = ({
  headerTitle,
  title,
  ApiObjectContext,
  placeHolderMessage,
  handleExpiredAuth,
  helpText,
  redirectTag,
  waitForApi = true,
}) => {
  const { apiObject, dispatch } = React.useContext(ApiObjectContext);
  const { event } = React.useContext(AnalyticsContext);
  const { updateHeader } = React.useContext(HeaderContext);

  const [actionMsg, setActionMsg] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
  const [created, setCreated] = React.useState(null);
  const [duplicate, setDuplicate] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [longPress, setLongPress] = React.useState(false);

  const [performAsync, setPerformAsync] = React.useState(null); // Handles dispatches without duplicating reducer actions
  const [itemsFetched, setItemsFetched] = React.useState({
    success: false,
    complete: false,
  });

  const [listSize, setListSize] = React.useState(calculateMaxHeight());
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
    if (!performAsync) return;
    dispatch(performAsync);
    if (performAsync.type === ApiActions.FailureAuth) handleExpiredAuth();
    if (performAsync.type === ApiActions.DuplicateObject) setDuplicate(true);
    setPerformAsync(null);
  }, [performAsync]); // eslint-disable-line

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    dispatch({
      type: ApiActions.StartList,
      func: ApiFuctions.asyncList,
      dispatch: setPerformAsync,
      callback: setItemsFetched,
      page: params.get(Constants.pageLookupParam),
    });
  }, []); // eslint-disable-line

  React.useEffect(() => {
    updateHeader({
      title: headerTitle,
      create: handleCreate,
      transaction: apiObject.transaction,
      disableNav: false,
    });
  }, [apiObject.transaction]); // eslint-disable-line

  const handleCreate = () => {
    if (apiObject.transaction) return;
    setCreated({ id: -1, name: "" });
    setSelected(-1);
  };

  const handleSave = async (name) => {
    if (apiObject.transaction) return;
    event(IndexedAnalyticsActions[apiObject.class].create);
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
    event(IndexedAnalyticsActions[apiObject.class].delete);
    setPerformAsync({
      type: ApiActions.StartDel,
      func: ApiFuctions.asyncDel,
      dispatch: setPerformAsync,
      payload: { id },
    });
  };

  const clearError = () => {
    setPerformAsync({ type: ApiActions.ClearErrors });
  };

  const handlePagination = (page) => {
    setPerformAsync({
      type: ApiActions.StartList,
      func: ApiFuctions.asyncList,
      dispatch: setPerformAsync,
      callback: setItemsFetched,
      override: page,
    });
  };

  // Bundle Up Props For List Items

  const listFunctions = {
    add: handleSave,
    del: handleDelete,
    setDuplicate,
    setSelected,
    setErrorMsg,
    setCreated,
    setLongPress,
    setActionMsg,
  };

  const listValues = {
    duplicate,
    errorMsg,
    selected,
    transaction: apiObject.transaction,
    longPress,
  };

  return (
    <>
      <ErrorHandler
        condition={apiObject.fail}
        clearError={clearError}
        eventMessage={AnalyticsActions.ApiError}
        messageTranslationKey={"SimpleList.ApiCommunicationError"}
        redirect={Routes.goBack}
      >
        <HoldingPattern condition={!itemsFetched.complete && waitForApi}>
          <Container tabs={true}>
            <Pagination
              apiObject={apiObject}
              handlePagination={handlePagination}
            />
            <Paper>
              {errorMsg ? (
                <ItemizedBanner className="alert alert-danger">
                  {errorMsg}
                </ItemizedBanner>
              ) : (
                <ItemizedBanner className="alert alert-success">
                  <div>{title}</div>
                </ItemizedBanner>
              )}
              <Scroller className="overflow-auto" size={listSize}>
                <ListBox>
                  {apiObject.inventory.map((item) => {
                    return (
                      <SimpleListItem
                        item={item}
                        key={item.id}
                        listFunctions={listFunctions}
                        listValues={listValues}
                        redirectTag={redirectTag}
                        objectClass={apiObject.class}
                      />
                    );
                  })}
                  {created ? (
                    <SimpleListItem
                      item={created}
                      listFunctions={listFunctions}
                      listValues={listValues}
                      redirectTag={redirectTag}
                      objectClass={apiObject.class}
                    />
                  ) : null}
                  {apiObject.inventory.length === 0 && !created ? (
                    <PlaceHolderListItem>
                      {placeHolderMessage}
                    </PlaceHolderListItem>
                  ) : null}
                </ListBox>
              </Scroller>
            </Paper>
            <Alert message={actionMsg} />
            <Hint>{helpText}</Hint>
          </Container>
        </HoldingPattern>
      </ErrorHandler>
    </>
  );
};

export default SimpleList;

SimpleList.propTypes = {
  headerTitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  ApiObjectContext: PropTypes.object.isRequired,
  placeHolderMessage: PropTypes.string.isRequired,
  handleExpiredAuth: PropTypes.func.isRequired,
  helpText: PropTypes.string.isRequired,
  redirectTag: PropTypes.string.isRequired,
};
