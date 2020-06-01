import { Paths } from "../../../configuration/backend";
import { Backend } from "../../../util/requests";
import ApiActions from "../api.actions";

export const performAdd = async ({ state, action }) => {
  const { payload, dispatch } = action;
  const [response, status] = await Backend("POST", Paths.manageShelves, {
    name: payload,
  });
  if (status === 200) {
    return new Promise(function (resolve) {
      dispatch({
        type: ApiActions.SuccessAdd,
        payload: response,
      });
    });
  }
  return dispatch({
    type: ApiActions.FailureAdd,
  });
};

export const performList = async ({ state, action }) => {
  const { dispatch } = action;
  const [response, status] = await Backend("GET", Paths.manageShelves);
  if (status === 200) {
    return new Promise(function (resolve) {
      dispatch({
        type: ApiActions.SuccessList,
        payload: response,
      });
    });
  }
  return dispatch({
    type: ApiActions.FailureList,
  });
};

export const asyncAdd = async (dispatch, payload) => {
  await dispatch({
    type: ApiActions.StartAdd,
    payload,
    func: performAdd,
  });
};

export const asyncDel = async ({ state, action }) => {
  const { dispatch } = action;
  const [response, status] = await Backend(
    "DELETE",
    Paths.manageShelves + `${action.payload.id}/`
  );
  if (status === 200) {
    return new Promise(function (resolve) {
      dispatch({
        type: ApiActions.SuccessDel,
        payload: { inventory: response },
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
  if (status === 200) {
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
