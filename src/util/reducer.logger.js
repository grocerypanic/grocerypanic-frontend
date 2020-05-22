// Simple Logging Middleware for useReducer

const jestRunning = () => {
  return process.env.JEST_WORKER_ID !== undefined;
};

const productionRunning = () => {
  return process.env.NODE_ENV === "production";
};

const reducerLoggingMiddleware = (reducer) => {
  let logging = true;
  let name = reducer.name;
  if (jestRunning()) logging = false;
  if (productionRunning()) logging = false;
  const wrappedReducer = (state, action) => {
    if (logging)
      console.log(`** ${name} BEFORE ${action.type}:\n`, { state, action });
    state = reducer(state, action);
    if (logging)
      console.log(`** ${name} AFTER ${action.type}:\n`, { state, action });
    return state;
  };
  return wrappedReducer;
};

export default reducerLoggingMiddleware;
