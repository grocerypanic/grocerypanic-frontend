import InitialState from "./transaction.initial";
import { Paths } from "../../../configuration/backend";
import Request from "../../../util/requests";
import { match2xx, match400duplicate } from "../../../util/requests/status";
import ApiActions from "../api.actions";
import {
  authFailure,
  duplicateObject,
  asyncDispatch,
} from "../api.async.helpers";
import { generateConverter } from "../generators/generate.converter";

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

/* istanbul ignore next */
export const asyncList = async ({ state, action }) => "Not Implemented";

/* istanbul ignore next */
export const asyncDel = ({ state, action }) => "Not Implemented";

/* istanbul ignore next */
export const asyncGet = ({ state, action }) => "Not Implemented";

/* istanbul ignore next */
export const asyncUpdate = ({ state, action }) => "Not Implemented";
