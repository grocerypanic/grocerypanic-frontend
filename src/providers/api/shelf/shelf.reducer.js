import ApiActions from "../api.actions";
import withMiddleware from "../../../util/user.middleware";
import reducerLoggingMiddleware from "../../../util/reducer.logger";

const shelfReducer = (state, action) => {
  switch (action.type) {
    case ApiActions.StartAdd:
    case ApiActions.StartDel:
      // Triggers API Function, starts transaction
      const newState = {
        ...state,
        transaction: true,
      };
      new Promise(function (resolve) {
        action.func({ state: newState, action, dispatch: wrappedReducer });
      });
      return newState;
    case ApiActions.FailureAdd:
    case ApiActions.FailureDel:
      // Must return an error message to inform user
      return {
        ...state,
        error: true,
        transaction: false,
        ...action.payload,
      };
    case ApiActions.SuccessAdd:
    case ApiActions.SuccessDel:
      // Must return a new list of shelves
      return {
        ...state,
        errorMessage: null,
        error: false,
        transaction: false,
        ...action.payload,
      };
    default:
      return state;
  }
};

const middlewares = [reducerLoggingMiddleware];
const wrappedReducer = withMiddleware(shelfReducer, middlewares);
export default wrappedReducer;
