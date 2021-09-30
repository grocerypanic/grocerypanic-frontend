import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import SimpleListItem from "./simple-list-item/simple-list-item.component";
import { Scroller, ListBox, PlaceHolderListItem } from "./simple-list.styles";
import { Constants } from "../../configuration/backend";
import Routes from "../../configuration/routes";
import { ui } from "../../configuration/theme";
import { ItemizedBanner } from "../../global-styles/banner";
import { Paper, Container } from "../../global-styles/containers";
import {
  AnalyticsActions,
  IndexedAnalyticsActions,
} from "../../providers/analytics/analytics.actions";
import { AnalyticsContext } from "../../providers/analytics/analytics.provider";
import ApiActions from "../../providers/api/api.actions";
import ApiFunctions from "../../providers/api/api.functions";
import { HeaderContext } from "../../providers/header/header.provider";
import calculateMaxHeight from "../../util/height";
import preventContext from "../../util/preventDefault";
import Alert from "../alert/alert.component";
import ErrorHandler from "../error-handler/error-handler.component";
import Hint from "../hint/hint.component";
import HoldingPattern from "../holding-pattern/holding-pattern.component";
import Pagination from "../pagination/pagination.component";

export const testIDs = {};

const SimpleList = ({
  headerTitle,
  title,
  ApiObjectContext,
  placeHolderMessage,
  handleExpiredAuth,
  helpText,
  redirectTag,
  history,
}) => {
  const { apiObject, dispatch } = React.useContext(ApiObjectContext);
  const { event } = React.useContext(AnalyticsContext);
  const { updateHeader } = React.useContext(HeaderContext);
  const { t } = useTranslation();

  const [actionMsg, setActionMsg] = React.useState(null);
  const [created, setCreated] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);

  const [performAsync, setPerformAsync] = React.useState(null);
  const [itemsFetched, setItemsFetched] = React.useState({
    success: false,
    complete: false,
  });

  const [listSize, setListSize] = React.useState(calculateMaxHeight());

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
    if (performAsync.type === ApiActions.DuplicateObject)
      flashErrorMessage(t("ItemDetails.ValidationAlreadyExists"));
    if (performAsync.type === ApiActions.RequiredObject)
      flashErrorMessage(t("ItemDetails.ResourceIsRequired"));
    setPerformAsync(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [performAsync]);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    dispatch({
      type: ApiActions.StartList,
      func: ApiFunctions.asyncList,
      dispatch: setPerformAsync,
      callback: setItemsFetched,
      page: params.get(Constants.pageLookupParam),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    updateHeader({
      title: headerTitle,
      create: handleCreate,
      transaction: apiObject.transaction,
      disableNav: false,
    });
  }, [apiObject.transaction]); // eslint-disable-line

  const clearError = () => {
    setPerformAsync({ type: ApiActions.ClearErrors });
  };

  const flashErrorMessage = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), ui.alertTimeout);
  };

  const flashActionMessage = (msg) => {
    setActionMsg(msg);
    setTimeout(() => {
      setActionMsg(null);
    }, ui.alertTimeout);
  };

  const handleCreate = () => {
    if (apiObject.transaction) return;
    setCreated({ id: -1, name: "" });
    setSelected(-1);
  };

  const handleSave = async (name) => {
    if (apiObject.transaction) return;
    if (name.length < 2) {
      flashErrorMessage(t("SimpleList.ValidationFailure"));
      return;
    }
    flashActionMessage(`${t("SimpleList.CreatedAction")} ${name}`);
    event(IndexedAnalyticsActions[apiObject.class].create);
    setPerformAsync({
      type: ApiActions.StartAdd,
      func: ApiFunctions.asyncAdd,
      dispatch: setPerformAsync,
      payload: { name },
    });
    setCreated(null);
  };

  const handleDelete = (id, name) => {
    if (apiObject.transaction) return;
    setSelected(null);
    flashActionMessage(`${t("SimpleList.DeletedAction")} ${name}`);
    event(IndexedAnalyticsActions[apiObject.class].delete);
    setPerformAsync({
      type: ApiActions.StartDel,
      func: ApiFunctions.asyncDel,
      dispatch: setPerformAsync,
      payload: { id },
    });
  };

  const handlePagination = (page) => {
    setPerformAsync({
      type: ApiActions.StartList,
      func: ApiFunctions.asyncList,
      dispatch: setPerformAsync,
      callback: setItemsFetched,
      override: page,
    });
  };

  const recalculateHeight = () => setListSize(calculateMaxHeight());

  return (
    <>
      <ErrorHandler
        condition={apiObject.fail}
        clearError={clearError}
        eventMessage={AnalyticsActions.ApiError}
        messageTranslationKey={"SimpleList.ApiCommunicationError"}
        redirect={Routes.goBack}
      >
        <HoldingPattern condition={!itemsFetched.complete}>
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
                  {title}
                </ItemizedBanner>
              )}
              <Scroller className="overflow-auto" size={listSize}>
                <ListBox>
                  {apiObject.inventory.map((item) => {
                    return (
                      <SimpleListItem
                        key={item.id}
                        history={history}
                        item={item}
                        handleDelete={handleDelete}
                        handleSave={handleSave}
                        setErrorMsg={setErrorMsg}
                        objectClass={apiObject.class}
                        transaction={apiObject.transaction}
                        redirectTag={redirectTag}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    );
                  })}
                  {created ? (
                    <SimpleListItem
                      history={history}
                      item={created}
                      handleDelete={handleDelete}
                      handleSave={handleSave}
                      setErrorMsg={setErrorMsg}
                      objectClass={apiObject.class}
                      transaction={apiObject.transaction}
                      redirectTag={redirectTag}
                      selected={selected}
                      setSelected={setSelected}
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

export default withRouter(SimpleList);

SimpleList.propTypes = {
  headerTitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  ApiObjectContext: PropTypes.object.isRequired,
  placeHolderMessage: PropTypes.string.isRequired,
  handleExpiredAuth: PropTypes.func.isRequired,
  helpText: PropTypes.string.isRequired,
  redirectTag: PropTypes.string.isRequired,
};
