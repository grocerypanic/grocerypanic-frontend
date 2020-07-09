import { Paths } from "../../../configuration/backend";
import { match2xx, match400duplicate } from "../../../util/requests/status";
import Request from "../../../util/requests";
import ApiActions from "../api.actions";
import {
  authFailure,
  duplicateObject,
  asyncDispatch,
  calculateListUrl,
} from "../api.async.helpers";
import { generateConverter } from "../api.util.js";
import InitialState from "./item.initial";

const convertDatesToLocal = generateConverter(InitialState.class);

export const asyncAdd = async ({ state, action }) => {
  const { dispatch, callback } = action;
  const [response, status] = await Request("POST", Paths.manageItems, {
    ...action.payload,
  });
  // Status Code is 2xx
  if (match2xx(status)) {
    new Promise((resolve) => {
      state.inventory.unshift(convertDatesToLocal(response));
      dispatch({
        type: ApiActions.SuccessAdd,
        payload: {
          inventory: state.inventory,
        },
        callback,
      });
    });
    return;
  }
  // Duplicate Object Errors
  if (match400duplicate(status, response))
    return duplicateObject(dispatch, callback);
  if (status === 401) return authFailure(dispatch, callback);
  asyncDispatch(dispatch, {
    type: ApiActions.FailureAdd,
    callback,
  });
  return;
};

export const asyncDel = async ({ state, action }) => {
  const { dispatch, callback } = action;
  const [, status] = await Request(
    "DELETE",
    Paths.manageItems + `${action.payload.id}/`
  );
  // Status Code is 2xx
  if (match2xx(status)) {
    new Promise((resolve) => {
      dispatch({
        type: ApiActions.SuccessDel,
        payload: {
          inventory: state.inventory.filter(
            (item) => item.id !== action.payload.id
          ),
        },
        callback,
      });
    });
    return;
  }
  if (status === 401) return authFailure(dispatch, callback);
  asyncDispatch(dispatch, {
    type: ApiActions.FailureDel,
    callback,
  });
  return;
};

export const asyncGet = async ({ state, action }) => {
  const { dispatch, callback } = action;
  const [response, status] = await Request(
    "GET",
    Paths.manageItems + `${action.payload.id}/`
  );
  // Status Code is 2xx
  if (match2xx(status)) {
    new Promise((resolve) => {
      // Update the item in state if it exists, otherwise add it as a new item
      const newInventory = [...state.inventory];
      const index = newInventory.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index >= 0) newInventory[index] = convertDatesToLocal(response);
      if (index < 0) newInventory.push(convertDatesToLocal(response));
      dispatch({
        type: ApiActions.SuccessGet,
        payload: {
          inventory: newInventory,
        },
        callback,
      });
    });
    return;
  }
  if (status === 401) return authFailure(dispatch, callback);
  asyncDispatch(dispatch, {
    type: ApiActions.FailureGet,
    callback,
  });
  return;
};

export const asyncList = async ({ state, action }) => {
  const { dispatch, callback } = action;
  let url = calculateListUrl(action, Paths.manageItems);

  const [response, status] = await Request("GET", url);
  if (match2xx(status)) {
    new Promise((resolve) => {
      const processedResponse = response.results.map((i) =>
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
    });
    return;
  }
  if (status === 401) return authFailure(dispatch, callback);
  asyncDispatch(dispatch, {
    type: ApiActions.FailureList,
    callback,
  });
  return;
};

export const asyncUpdate = async ({ state, action }) => {
  const { dispatch, callback } = action;
  const [response, status] = await Request(
    "PUT",
    Paths.manageItems + `${action.payload.id}/`,
    { ...action.payload }
  );
  // Status Code is 2xx
  if (match2xx(status)) {
    return new Promise((resolve) => {
      const index = state.inventory.findIndex(
        (item) => item.id === action.payload.id
      );
      state.inventory[index] = convertDatesToLocal(response);
      dispatch({
        type: ApiActions.SuccessUpdate,
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
    type: ApiActions.FailureUpdate,
    callback,
  });
};
