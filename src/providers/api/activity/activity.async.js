import { Paths } from "../../../configuration/backend";
import Request from "../../../util/requests";
import { match2xx } from "../../../util/requests/status";
import ApiActions from "../api.actions";
import { authFailure, asyncDispatch } from "../api.async.helpers";

const updateInventory = (state, action, response) => {
  const updatedInventory = [...state.inventory];
  const index = updatedInventory.findIndex(
    (item) => item.id === action.payload.id
  );
  if (index >= 0) updatedInventory[index] = response;
  if (index < 0) updatedInventory.push(response);
  return updatedInventory;
};

export const asyncGet = async ({ state, action }) => {
  const { dispatch, callback } = action;

  const [response, status] = await Request(
    "GET",
    Paths.manageActivity + `${action.payload.id}/`
  );
  new Promise((resolve) => {
    if (match2xx(status)) {
      const updatedInventory = updateInventory(state, action, response);
      dispatch({
        type: ApiActions.SuccessGet,
        payload: {
          inventory: updatedInventory,
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

/* istanbul ignore next */
export const asyncAdd = ({ state, action }) => "Not Implemented";

/* istanbul ignore next */
export const asyncDel = ({ state, action }) => "Not Implemented";

/* istanbul ignore next */
export const asyncList = ({ state, action }) => "Not Implemented";

/* istanbul ignore next */
export const asyncUpdate = ({ state, action }) => "Not Implemented";
