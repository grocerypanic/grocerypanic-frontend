import { Paths } from "../../../configuration/backend";
import match2xx from "../../../util/requests/status";
import Request from "../../../util/requests";
import ApiActions from "../api.actions";
import { apiResultCompare, convertDatesToLocal } from "../api.util.js";

const authFailure = (dispatch, callback) => {
  return new Promise(function (resolve) {
    dispatch({ type: ApiActions.FailureAuth, callback });
  });
};

export const asyncAdd = async ({ state, action }) => {
  const { dispatch, callback } = action;
  const [response, status] = await Request(
    "POST",
    Paths.manageTransactions,
    action.payload
  );
  // Status Code is 2xx
  if (match2xx(status)) {
    return new Promise(function (resolve) {
      const newInventory = [...state.inventory];
      newInventory.push(convertDatesToLocal(response));
      dispatch({
        type: ApiActions.SuccessAdd,
        payload: {
          inventory: [...newInventory].sort(apiResultCompare),
        },
        callback,
      });
    });
  }
  if (status === 401) return authFailure(dispatch, callback);
  return dispatch({
    type: ApiActions.FailureAdd,
    callback,
  });
};

export const asyncList = async ({ state, action }) => {
  const { dispatch, callback } = action;
  const [response, status] = await Request(
    "GET",
    Paths.manageTransactions + action.payload.id + "/item/"
  );
  if (match2xx(status)) {
    const processedResponse = response.map((i) => convertDatesToLocal(i));
    return new Promise(function (resolve) {
      dispatch({
        type: ApiActions.SuccessList,
        payload: { inventory: processedResponse.sort(apiResultCompare) },
        callback,
      });
    });
  }
  if (status === 401) return authFailure(dispatch, callback);
  return dispatch({
    type: ApiActions.FailureList,
    callback,
  });
};

/* istanbul ignore next */
export const asyncDel = ({ state, action }) => "Not Implemented";

/* istanbul ignore next */
export const asyncGet = ({ state, action }) => "Not Implemented";

/* istanbul ignore next */
export const asyncUpdate = ({ state, action }) => "Not Implemented";
