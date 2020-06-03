import UserActions from "./user.actions";
import withMiddleware from "../../util/user.middleware";
import reducerLoggingMiddleware from "../../util/reducer.logger";

const userReducer = (state, action) => {
  switch (action.type) {
    case UserActions.ResetUser:
      return {
        ...state,
        username: "",
        avatar: "",
        error: false,
        errorMessage: null,
        login: false,
      };
    case UserActions.StartFetchUser:
      new Promise(function (resolve) {
        action.func({ state, action });
      });
      return {
        ...state,
        login: false,
      };
    case UserActions.ToggleLogin:
      return {
        ...state,
        login: !state.login,
      };
    case UserActions.FailureFetchUser:
      return {
        ...state,
        username: action.payload.username,
        email: "",
        avatar: "",
        error: true,
        errorMessage: "ErrorLoginFailure", // Strings Key
        login: false,
      };
    case UserActions.AuthExpired:
      return {
        ...state,
        username: action.payload.username,
        email: "",
        avatar: "",
        error: true,
        errorMessage: "ErrorAuthExpired", // Strings Key
        login: false,
      };
    case UserActions.SuccessFetchUser:
      return {
        ...state,
        error: false,
        login: true,
        username: action.payload.username,
        avatar: action.payload.avatar,
        email: action.payload.email,
      };
    default:
      return state;
  }
};

const middlewares = [reducerLoggingMiddleware];
const wrappedReducer = withMiddleware(userReducer, middlewares);
export default wrappedReducer;
