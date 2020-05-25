import UserActions from "./user.actions";
import withMiddleware from "../../util/user.middleware";
import reducerLoggingMiddleware from "../../util/reducer.logger";

const userReducer = (state, action) => {
  switch (action.type) {
    case UserActions.StartFetchUser:
      new Promise(function (resolve) {
        action.func({ state, action, dispatch: wrappedReducer });
      });
      return {
        ...state,
        ready: false,
      };
    case UserActions.ToggleReady:
      return {
        ...state,
        ready: !state.ready,
      };
    case UserActions.FailureFetchUser:
      return {
        username: action.payload.username,
        email: null,
        avatar: null,
        error: true,
        ready: false,
      };
    case UserActions.SuccessFetchUser:
      return {
        error: false,
        ready: true,
        ...action.payload,
      };
    default:
      return state;
  }
};

const middlewares = [reducerLoggingMiddleware];
const wrappedReducer = withMiddleware(userReducer, middlewares);
export default wrappedReducer;
