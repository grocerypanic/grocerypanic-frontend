import ApiActions from "../api.actions";

import withMiddleware from "../../../util/user.middleware";
import reducerLoggingMiddleware from "../../../util/reducer.logger";

const generateReducer = (async, name) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case ApiActions.StartAdd:
      case ApiActions.StartDel:
      case ApiActions.StartGet:
      case ApiActions.StartList:
      case ApiActions.StartUpdate:
        // Triggers API Function, starts transaction
        const newState = {
          ...state,
          inventory: [...state.inventory],
          transaction: true,
        };
        new Promise(function (resolve) {
          if (action.callback)
            action.callback({ success: false, complete: false });
          async[action.func]({ state: newState, action });
        });
        return newState;
      case ApiActions.FailureAdd:
      case ApiActions.FailureDel:
      case ApiActions.FailureGet:
      case ApiActions.FailureList:
      case ApiActions.FailureUpdate:
        // Must return an error message to inform user
        new Promise(function (resolve) {
          if (action.callback)
            action.callback({ success: false, complete: true });
        });
        return {
          ...state,
          inventory: [...state.inventory],
          error: true,
          transaction: false,
          ...action.payload,
        };
      case ApiActions.SuccessAdd:
      case ApiActions.SuccessDel:
      case ApiActions.SuccessGet:
      case ApiActions.SuccessList:
      case ApiActions.SuccessUpdate:
        // Must return a new list of shelves
        new Promise(function (resolve) {
          if (action.callback)
            action.callback({ success: true, complete: true });
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
          if (action.callback)
            action.callback({ success: false, complete: false });
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
          if (action.callback)
            action.callback({ success: false, complete: false });
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

  Object.defineProperty(reducer, "name", { value: name });

  const middlewares = [reducerLoggingMiddleware];
  return withMiddleware(reducer, middlewares);
};

export default generateReducer;
