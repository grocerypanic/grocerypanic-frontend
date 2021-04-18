import { Paths } from "../../../configuration/backend";
import { match2xx, match400duplicate } from "../../../util/requests/status";
import Request from "../../../util/requests";
import ApiActions from "../api.actions";
import {
  authFailure,
  duplicateObject,
  asyncDispatch,
} from "../api.async.helpers";

/* istanbul ignore next */
export const asyncAdd = async ({ state, action }) => "Not Implemented";

/* istanbul ignore next */
export const asyncList = async ({ state, action }) => "Not Implemented";

/* istanbul ignore next */
export const asyncDel = ({ state, action }) => "Not Implemented";

export const asyncGet = async ({ state, action }) => {
  const { dispatch, callback } = action;
  const [response, status] = await Request("GET", Paths.manageUsers);
  new Promise((resolve) => {
    if (match2xx(status)) {
      const newInventory = [response];
      dispatch({
        type: ApiActions.SuccessGet,
        payload: {
          inventory: newInventory,
        },
        callback,
      });
      return;
    }
    if (status === 401) return authFailure(dispatch, callback);
    throw Error("Unknown Status Code");
  }).catch((err) => {
    asyncDispatch(dispatch, {
      type: ApiActions.FailureGet,
      callback,
    });
  });
};

export const asyncUpdate = async ({ state, action }) => {
  const { dispatch, callback } = action;
  const [response, status] = await Request("PUT", Paths.manageUsers, {
    ...action.payload,
  });
  return new Promise((resolve) => {
    if (match2xx(status)) {
      const index = state.inventory.findIndex(
        (item) => item.id === action.payload.id
      );
      state.inventory[index] = response;
      dispatch({
        type: ApiActions.SuccessUpdate,
        payload: {
          inventory: state.inventory,
        },
        callback,
      });
      return;
    }
    if (match400duplicate(status, response))
      return duplicateObject(dispatch, callback);
    if (status === 401) return authFailure(dispatch, callback);
    throw Error("Unknown Status Code");
  }).catch((err) => {
    asyncDispatch(dispatch, {
      type: ApiActions.FailureUpdate,
      callback,
    });
  });
};
