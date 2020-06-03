import ApiActions from "../api.actions";

import withMiddleware from "../../../util/user.middleware";
import reducerLoggingMiddleware from "../../../util/reducer.logger";

import * as async from "./shelf.async";

const shelfReducer = (state, action) => {
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
        async[action.func]({ state: newState, action });
      });
      return newState;
    case ApiActions.FailureList:
    case ApiActions.FailureAdd:
    case ApiActions.FailureDel:
      // Must return an error message to inform user
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
      return {
        ...state,
        inventory: [...state.inventory],
        errorMessage: null,
        error: false,
      };
    case ApiActions.FailureAuth:
      // Clears out any error message, let's higher order components handle relogin
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
const wrappedReducer = withMiddleware(shelfReducer, middlewares);
export default wrappedReducer;
