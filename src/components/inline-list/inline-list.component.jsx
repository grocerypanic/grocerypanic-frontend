import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import InlineListForm from "./inline-list.form/inline-list.form.component";
import InlineListItem from "./inline-list.item/inline-list.item.component";
import {
  InlineListScroller,
  InlineListBox,
  InlineListPlaceHolder,
} from "./inline-list.styles";
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

export const createItemDefaults = {
  id: -1,
  name: "",
};

const InlineList = ({
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
  const [successMsg, setSuccessMsg] = React.useState(null);

  const [performAsync, setPerformAsync] = React.useState(null);
  const [itemsFetched, setItemsFetched] = React.useState({
    success: false,
    complete: false,
  });

  const [listSize, setListSize] = React.useState(calculateMaxHeight());

  let actionMessageTimer;
  let errorMessageTimer;

  React.useEffect(() => {
    window.addEventListener("resize", recalculateHeight);
    window.addEventListener("contextmenu", preventContext);
    return () => {
      window.removeEventListener("resize", recalculateHeight);
      window.removeEventListener("contextmenu", preventContext);
      clearTimeout(actionMessageTimer);
      clearTimeout(errorMessageTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!performAsync) return;
    dispatch(performAsync);
    if (performAsync.type === ApiActions.FailureAuth) handleExpiredAuth();
    if (performAsync.type === ApiActions.DuplicateObject)
      flashErrorMessage(t("ItemDetails.ValidationAlreadyExists"));
    if (performAsync.type === ApiActions.RequiredObject)
      flashErrorMessage(t("ItemDetails.ResourceIsRequired"));
    if (performAsync.type === ApiActions.SuccessAdd) successSave();
    if (performAsync.type === ApiActions.SuccessDel) successDelete();
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
    clearTimeout(errorMessageTimer);
    setErrorMsg(msg);
    errorMessageTimer = setTimeout(() => setErrorMsg(null), ui.alertTimeout);
  };

  const flashActionMessage = (msg) => {
    clearTimeout(actionMessageTimer);
    setActionMsg(msg);
    actionMessageTimer = setTimeout(() => {
      setActionMsg(null);
    }, ui.alertTimeout);
  };

  const handleCreate = () => {
    if (apiObject.transaction) return;
    setCreated(createItemDefaults);
    setSelected(createItemDefaults.id);
  };

  const successSave = () => {
    event(IndexedAnalyticsActions[apiObject.class].create);
    flashActionMessage(successMsg);
    setCreated(null);
  };

  const handleSave = async (name) => {
    if (name.length < 2) {
      flashErrorMessage(t("InlineList.ValidationFailure"));
      return;
    }
    setSuccessMsg(`${t("InlineList.CreatedAction")} ${name}`);
    setPerformAsync({
      type: ApiActions.StartAdd,
      func: ApiFunctions.asyncAdd,
      dispatch: setPerformAsync,
      payload: { name },
    });
  };

  const successDelete = () => {
    event(IndexedAnalyticsActions[apiObject.class].delete);
    flashActionMessage(successMsg);
  };

  const handleDelete = (id, name) => {
    if (apiObject.transaction) return;
    setSelected(null);
    setSuccessMsg(`${t("InlineList.DeletedAction")} ${name}`);
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
        messageTranslationKey={"InlineList.ApiCommunicationError"}
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
              <InlineListScroller className="overflow-auto" size={listSize}>
                <InlineListBox>
                  {apiObject.inventory.map((item) => {
                    return (
                      <InlineListItem
                        item={item}
                        key={item.id}
                        handleDelete={handleDelete}
                        history={history}
                        objectClass={apiObject.class}
                        transaction={apiObject.transaction}
                        redirectTag={redirectTag}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    );
                  })}
                  {created ? (
                    <InlineListForm
                      item={created}
                      handleSave={handleSave}
                      setErrorMsg={setErrorMsg}
                      setSelected={setSelected}
                      transaction={apiObject.transaction}
                    />
                  ) : null}
                  {apiObject.inventory.length === 0 && !created ? (
                    <InlineListPlaceHolder>
                      {placeHolderMessage}
                    </InlineListPlaceHolder>
                  ) : null}
                </InlineListBox>
              </InlineListScroller>
            </Paper>
            <Alert message={actionMsg} />
            <Hint>{helpText}</Hint>
          </Container>
        </HoldingPattern>
      </ErrorHandler>
    </>
  );
};

export default withRouter(InlineList);

InlineList.propTypes = {
  headerTitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  ApiObjectContext: PropTypes.object.isRequired,
  placeHolderMessage: PropTypes.string.isRequired,
  handleExpiredAuth: PropTypes.func.isRequired,
  helpText: PropTypes.string.isRequired,
  redirectTag: PropTypes.string.isRequired,
};
