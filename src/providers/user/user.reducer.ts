import type { UserActionType } from "./types/user.actions";
import type { UserStateInterface } from "./types/user.state";
import SocialReducerState from "./user.reducer.states.class";
import withMiddleware from "../../util/middleware";
import reducerLoggingMiddleware from "../../util/reducer.logger";

const userReducer = (state: UserStateInterface, action: UserActionType) => {
  const stateMethod = action.type;
  const stateGenerator = new SocialReducerState();
  const newState = stateGenerator[stateMethod](state, action);
  return newState;
};

const middlewares = [reducerLoggingMiddleware];
const wrappedReducer = withMiddleware(userReducer, middlewares);
export default wrappedReducer as typeof userReducer;
