import ApiActions from "../api.actions";

import withMiddleware from "../../../util/user.middleware";
import reducerLoggingMiddleware from "../../../util/reducer.logger";

import * as async from "./store.async";

const storeReducer = (state, action) => {
  switch (action.type) {
    case ApiActions.StartList:
    case ApiActions.StartAdd:
    case ApiActions.StartDel:
      // Triggers API Function, starts transaction
      const newState = {
        ...state,
        inventory: [...state.inventory],
        transaction: true,
      };
      new Promise(function (resolve) {
        if (action.callback) action.callback(false);
        async[action.func]({ state: newState, action });
      });
      return newState;
    case ApiActions.FailureList:
    case ApiActions.FailureAdd:
    case ApiActions.FailureDel:
      // Must return an error message to inform user
      new Promise(function (resolve) {
        if (action.callback) action.callback(true);
      });
      return {
        ...state,
        inventory: [...state.inventory],
        error: true,
        transaction: false,
        ...action.payload,
      };
    case ApiActions.SuccessList:
    case ApiActions.SuccessAdd:
    case ApiActions.SuccessDel:
      // Must return a new list of shelves
      new Promise(function (resolve) {
        if (action.callback) action.callback(true);
      });
      return {
        ...state,
        inventory: [...state.inventory],
        errorMessage: null,
        error: false,
        transaction: false,
        ...action.payload,
      };
    case ApiActions.ClearErrors:
      // Clears out any error message
      new Promise(function (resolve) {
        if (action.callback) action.callback(false);
      });
      return {
        ...state,
        inventory: [...state.inventory],
        errorMessage: null,
        error: false,
      };
    case ApiActions.FailureAuth:
      // Clears out any error message, let's higher order components handle relogin
      new Promise(function (resolve) {
        if (action.callback) action.callback(true);
      });
      return {
        ...state,
        inventory: [...state.inventory],
        transaction: false,
        errorMessage: null,
        error: false,
      };
    default:
      return state;
  }
};

const middlewares = [reducerLoggingMiddleware];
const wrappedReducer = withMiddleware(storeReducer, middlewares);
export default wrappedReducer;
