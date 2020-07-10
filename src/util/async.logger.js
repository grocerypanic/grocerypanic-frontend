// Simple Logging Middleware for useReducer

const jestRunning = () => {
  return process.env.JEST_WORKER_ID !== undefined;
};

const productionRunning = () => {
  return process.env.NODE_ENV === "production";
};

const logMessage = (when, name, state, action, duration = null) => {
  console.log(
    `%c ** ASYNCHRONOUS -- ${name} ${when}:`,
    "color: purple; font-weight: bold;"
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

const withAsyncLogger = (asyncAction) => {
  let startTime;
  let logging = true;
  let name = asyncAction.name;
  if (jestRunning()) logging = false;
  if (productionRunning()) logging = false;
  const wrappedAction = ({ state, action }) => {
    if (logging) {
      startTime = performance.now();
      logMessage("START", name, state, action);
    }
    const result = asyncAction({ state, action });
    if (logging) {
      result.then((value) => {
        logMessage("END", name, state, action, performance.now() - startTime);
      });
    }
  };
  return wrappedAction;
};

export default withAsyncLogger;
