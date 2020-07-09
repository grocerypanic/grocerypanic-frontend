// Simple Logging Middleware for useReducer

const jestRunning = () => {
  return process.env.JEST_WORKER_ID !== undefined;
};

const productionRunning = () => {
  return process.env.NODE_ENV === "production";
};

const logMessage = (when, name, state, action, duration = null) => {
  console.log(
    `%c ** ${name} ${when} ${action.type}:`,
    "color: blue; font-weight: bold;"
  );
  if (duration) {
    console.log(
      "%c   Time:",
      "color: red; font-weight: bold;",
      duration / 1000
    );
  }
  console.log("%c   State:", "color: green; font-weight: bold;", state);
  console.log("%c   Action:", "color: green; font-weight: bold;", action);
};

const reducerLoggingMiddleware = (reducer) => {
  let startTime;
  let logging = true;
  let name = reducer.name;
  if (jestRunning()) logging = false;
  if (productionRunning()) logging = false;
  const wrappedReducer = (state, action) => {
    if (logging) {
      startTime = performance.now();
      logMessage("BEFORE", name, state, action);
    }
    state = reducer(state, action);
    if (logging) {
      logMessage("AFTER", name, state, action, performance.now() - startTime);
    }
    return state;
  };
  return wrappedReducer;
};

export default reducerLoggingMiddleware;
