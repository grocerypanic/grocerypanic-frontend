import { Paths } from "../../../configuration/backend";
import { match2xx, match400duplicate } from "../../../util/requests/status";
import Request from "../../../util/requests";
import ApiActions from "../api.actions";
import { authFailure, duplicateObject } from "../api.async.helpers";

import { generateConverter } from "../api.util.js";
import InitialState from "./transaction.initial";

const convertDatesToLocal = generateConverter(InitialState.class);

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
      state.inventory.push(convertDatesToLocal(response));
      dispatch({
        type: ApiActions.SuccessAdd,
        payload: {
          inventory: state.inventory,
        },
        callback,
      });
    });
  }
  // Duplicate Object Errors
  if (match400duplicate(status, response))
    return duplicateObject(dispatch, callback);
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
    action.override
      ? action.override
      : Paths.manageTransactions +
          `?item=${encodeURIComponent(action.payload.id)}`
  );
  if (match2xx(status)) {
    const processedResponse = response.results.map((i) =>
      convertDatesToLocal(i)
    );
    return new Promise(function (resolve) {
      dispatch({
        type: ApiActions.SuccessList,
        payload: {
          inventory: processedResponse,
          next: response.next,
          previous: response.previous,
        },
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
