import { Paths } from "../../../configuration/backend";
import match2xx from "../../../util/requests/status";
import Request from "../../../util/requests";
import ApiActions from "../api.actions";
import { apiResultCompare } from "../api.util.js";

const authFailure = (dispatch, callback) => {
  return new Promise(function (resolve) {
    dispatch({ type: ApiActions.FailureAuth, callback });
  });
};

export const asyncAdd = async ({ state, action }) => {
  const { dispatch, callback } = action;
  const [response, status] = await Request("POST", Paths.manageTransactions, {
    name: action.payload.name,
  });
  // Status Code is 2xx
  if (match2xx(status)) {
    return new Promise(function (resolve) {
      const newInventory = [...state.inventory];
      newInventory.push(response);
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
    Paths.manageTransactions + action.payload.id + "/"
  );
  if (match2xx(status)) {
    return new Promise(function (resolve) {
      dispatch({
        type: ApiActions.SuccessList,
        payload: { inventory: response.sort(apiResultCompare) },
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