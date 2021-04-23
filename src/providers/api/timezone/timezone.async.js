import { Paths } from "../../../configuration/backend";
import { match2xx } from "../../../util/requests/status";
import Request from "../../../util/requests";
import ApiActions from "../api.actions";
import {
  authFailure,
  calculateListUrl,
  asyncDispatch,
  retrieveResults,
} from "../api.async.helpers";

/* istanbul ignore next */
export const asyncAdd = async ({ state, action }) => "Not Implemented";

/* istanbul ignore next */
export const asyncList = async ({ state, action }) => {
  const { dispatch, callback } = action;
  let url = calculateListUrl(action, Paths.manageTimezones);

  const [response, status] = await Request("GET", url);
  new Promise((resolve) => {
    if (match2xx(status)) {
      dispatch({
        type: ApiActions.SuccessList,
        payload: {
          inventory: retrieveResults(response),
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
