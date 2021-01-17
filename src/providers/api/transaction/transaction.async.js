import { Paths } from "../../../configuration/backend";
import { match2xx, match400duplicate } from "../../../util/requests/status";
import Request from "../../../util/requests";
import ApiActions from "../api.actions";
import {
  authFailure,
  duplicateObject,
  asyncDispatch,
  calculateListUrl,
  retrieveResults,
} from "../api.async.helpers";

import { generateConverter } from "../generators/generate.converter";
import InitialState from "./transaction.initial";

const convertDatesToLocal = generateConverter(InitialState.class);

export const asyncAdd = async ({ state, action }) => {
  const { dispatch, callback } = action;
  const [response, status] = await Request(
    "POST",
    Paths.manageTransactions,
    action.payload
  );
  new Promise((resolve) => {
    // Status Code is 2xx
    if (match2xx(status)) {
      state.inventory.push(convertDatesToLocal(response));
      dispatch({
        type: ApiActions.SuccessAdd,
        payload: {
          inventory: state.inventory,
        },
        callback,
      });
      return;
    }
    // Duplicate Object Errors
    if (match400duplicate(status, response))
      return duplicateObject(dispatch, callback);
    if (status === 401) return authFailure(dispatch, callback);
    throw Error("Unknown Status Code");
  }).catch((err) => {
    asyncDispatch(dispatch, {
      type: ApiActions.FailureAdd,
      callback,
    });
  });
};

export const asyncList = async ({ state, action }) => {
  const { dispatch, callback } = action;
  const param = new URLSearchParams({ item: action.payload.id }).toString();

  let url;
  url = calculateListUrl(action, Paths.manageTransactions, param);

  const [response, status] = await Request("GET", url);
  new Promise((resolve) => {
    if (match2xx(status)) {
      const processedResponse = retrieveResults(response).map((i) =>
        convertDatesToLocal(i)
      );
      dispatch({
        type: ApiActions.SuccessList,
        payload: {
          inventory: processedResponse,
          next: response.next,
          previous: response.previous,
        },
        callback,
      });
      return;
    }
    if (status === 401) return authFailure(dispatch, callback);
    throw Error("Unknown Status Code");
  }).catch((err) => {
    asyncDispatch(dispatch, {
      type: ApiActions.FailureList,
      callback,
    });
  });
};

/* istanbul ignore next */
export const asyncDel = ({ state, action }) => "Not Implemented";

/* istanbul ignore next */
export const asyncGet = ({ state, action }) => "Not Implemented";

/* istanbul ignore next */
export const asyncUpdate = ({ state, action }) => "Not Implemented";
