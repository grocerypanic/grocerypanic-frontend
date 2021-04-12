import SocialActions from "./social.actions";
import withMiddleware from "../../util/middleware";
import reducerLoggingMiddleware from "../../util/reducer.logger";

const userReducer = (state, action) => {
  switch (action.type) {
    case SocialActions.ResetUser:
      return {
        ...state,
        username: "",
        avatar: "",
        error: false,
        errorMessage: null,
        login: false,
      };
    case SocialActions.StartFetchUser:
      new Promise(function (resolve) {
        action.func({ state, action });
      });
      return {
        ...state,
        login: false,
      };
    case SocialActions.ToggleLogin:
      return {
        ...state,
        login: !state.login,
      };
    case SocialActions.FailureFetchUser:
      return {
        ...state,
        username: action.payload.username,
        email: "",
        avatar: "",
        error: true,
        errorMessage: "SignIn.ErrorLoginFailure", // Strings Key
        login: false,
      };
    case SocialActions.AuthExpired:
      return {
        ...state,
        username: action.payload.username,
        email: "",
        avatar: "",
        error: true,
        errorMessage: "SignIn.ErrorAuthExpired", // Strings Key
        login: false,
      };
    case SocialActions.DuplicateAccount:
      return {
        ...state,
        username: "",
        email: "",
        avatar: "",
        error: true,
        errorMessage: "SignIn.ErrorDuplicateAccount", // Strings Key
        login: false,
      };
    case SocialActions.SuccessFetchUser:
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
