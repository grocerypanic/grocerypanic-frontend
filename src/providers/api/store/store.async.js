import { Paths } from "../../../configuration/backend";
import match2xx from "../../../util/requests/status";
import Request from "../../../util/requests";
import ApiActions from "../api.actions";

const authFailure = (dispatch) => {
  return new Promise(function (resolve) {
    dispatch({ type: ApiActions.FailureAuth });
  });
};

export const asyncAdd = async ({ state, action }) => {
  const { dispatch } = action;
  const [response, status] = await Request("POST", Paths.manageStores, {
    name: action.payload.name,
  });
  // Status Code is 2xx
  if (match2xx(status)) {
    return new Promise(function (resolve) {
      state.inventory.push(response);
      dispatch({
        type: ApiActions.SuccessAdd,
        payload: {
          inventory: state.inventory,
        },
      });
    });
  }
  if (status === 401) return authFailure(dispatch);
  return dispatch({
    type: ApiActions.FailureAdd,
  });
};

export const asyncDel = async ({ state, action }) => {
  const { dispatch } = action;
  const [, status] = await Request(
    "DELETE",
    Paths.manageStores + `${action.payload.id}/`
  );
  // Status Code is 2xx
  if (match2xx(status)) {
    return new Promise(function (resolve) {
      dispatch({
        type: ApiActions.SuccessDel,
        payload: {
          inventory: state.inventory.filter(
            (item) => item.id !== action.payload.id
          ),
        },
      });
    });
  }
  if (status === 401) return authFailure(dispatch);
  return dispatch({
    type: ApiActions.FailureDel,
  });
};

export const asyncList = async ({ state, action }) => {
  const { dispatch } = action;
  const [response, status] = await Request("GET", Paths.manageStores);
  if (match2xx(status)) {
    return new Promise(function (resolve) {
      dispatch({
        type: ApiActions.SuccessList,
        payload: { inventory: response },
      });
    });
  }
  if (status === 401) return authFailure(dispatch);
  return dispatch({
    type: ApiActions.FailureList,
  });
};