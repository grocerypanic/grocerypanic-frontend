import UserActions from "./user.actions";
import withMiddleware from "../../util/user.middleware";
import reducerLoggingMiddleware from "../../util/reducer.logger";

const userReducer = (state, action) => {
  const callback = { state, action, dispatch: userReducer };

  switch (action.type) {
    case UserActions.StartFetchUser:
      return action.func(callback);
    case UserActions.ToggleReady:
      return {
        ...state,
        ready: !state.ready,
      };
    case UserActions.FailureFetchUser:
      return {
        username: action.payload,
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
export default withMiddleware(userReducer, middlewares);
