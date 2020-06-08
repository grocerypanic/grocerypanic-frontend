// Simple Logging Middleware for useReducer

const jestRunning = () => {
  return process.env.JEST_WORKER_ID !== undefined;
};

const productionRunning = () => {
  return process.env.NODE_ENV === "production";
};

const logMessage = (when, name, state, action) => {
  console.log(
    `%c ** ${name} ${when} ${action.type}:`,
    "color: blue; font-weight: bold;"
  );
  console.log("%c   State:", "color: green; font-weight: bold;", state);
  console.log("%c   Action:", "color: green; font-weight: bold;", action);
};

const reducerLoggingMiddleware = (reducer) => {
  let logging = true;
  let name = reducer.name;
  if (jestRunning()) logging = false;
  if (productionRunning()) logging = false;
  const wrappedReducer = (state, action) => {
    if (logging) logMessage("BEFORE", name, state, action);
    state = reducer(state, action);
    if (logging) logMessage("AFTER", name, state, action);
    return state;
  };
  return wrappedReducer;
};

export default reducerLoggingMiddleware;
