import { Paths } from "../../../configuration/backend";
import { Backend } from "../../../util/requests";
import ApiActions from "../api.actions";

export const asyncAdd = async ({ state, action }) => {
  const { dispatch } = action;
  const [response, status] = await Backend("POST", Paths.manageShelves, {
    name: action.payload.name,
  });
  // Status Code is 2xx
  if (status.toString()[0] === "2") {
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
  return dispatch({
    type: ApiActions.FailureAdd,
  });
};

export const asyncDel = async ({ state, action }) => {
  const { dispatch } = action;
  const [, status] = await Backend(
    "DELETE",
    Paths.manageShelves + `${action.payload.id}/`
  );
  // Status Code is 2xx
  if (status.toString()[0] === "2") {
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
  return dispatch({
    type: ApiActions.FailureDel,
  });
};

export const asyncList = async ({ state, action }) => {
  const { dispatch } = action;
  const [response, status] = await Backend("GET", Paths.manageShelves);
  if (status.toString()[0] === "2") {
    return new Promise(function (resolve) {
      dispatch({
        type: ApiActions.SuccessList,
        payload: { inventory: response },
      });
    });
  }
  return dispatch({
    type: ApiActions.FailureList,
  });
};
