import withAsyncLogger from "../../../util/async.logger";
import withMiddleware from "../../../util/middleware";
import reducerLoggingMiddleware from "../../../util/reducer.logger";
import ApiActions from "../api.actions";

const generateReducer = (async, name) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case ApiActions.StartAdd:
      case ApiActions.StartDel:
      case ApiActions.StartGet:
      case ApiActions.StartList:
      case ApiActions.StartUpdate:
        const newState = {
          ...state,
          inventory: [...state.inventory],
          transaction: true,
        };
        const asyncFunc = withAsyncLogger(async[action.func]);
        new Promise(function (resolve) {
          if (action.callback)
            action.callback({ success: false, complete: false });
          asyncFunc({ state: newState, action });
        });
        return newState;
      case ApiActions.FailureAdd:
      case ApiActions.FailureDel:
      case ApiActions.FailureGet:
      case ApiActions.FailureList:
      case ApiActions.FailureUpdate:
        if (action.callback)
          new Promise(function (resolve) {
            action.callback({ success: false, complete: true });
          });
        return {
          ...state,
          inventory: [...state.inventory],
          fail: true,
          transaction: false,
          errorMessage: action.type,
        };
      case ApiActions.SuccessAdd:
      case ApiActions.SuccessDel:
      case ApiActions.SuccessGet:
      case ApiActions.SuccessList:
      case ApiActions.SuccessUpdate:
        // Must return a new list of shelves
        if (action.callback)
          new Promise(function (resolve) {
            action.callback({ success: true, complete: true });
          });
        return {
          ...state,
          inventory: [...state.inventory],
          errorMessage: null,
          fail: false,
          transaction: false,
          ...action.payload,
        };
      case ApiActions.ClearErrors:
        // Clears out any error message
        if (action.callback)
          new Promise(function (resolve) {
            action.callback({ success: false, complete: false });
          });
        return {
          ...state,
          inventory: [...state.inventory],
          errorMessage: null,
          fail: false,
        };
      case ApiActions.FailureAuth:
        if (action.callback)
          new Promise(function (resolve) {
            action.callback({ success: false, complete: false });
          });
        return {
          ...state,
          inventory: [...state.inventory],
          transaction: false,
          errorMessage: action.type,
          fail: false,
        };
      case ApiActions.DuplicateObject:
        if (action.callback)
          new Promise(function (resolve) {
            action.callback({ success: false, complete: false });
          });
        return {
          ...state,
          inventory: [...state.inventory],
          transaction: false,
          errorMessage: action.type,
          fail: false,
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
