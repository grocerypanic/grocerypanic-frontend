// Composition Function to Wrap Reducers With Custom Middlewares

const withMiddleware = (originalReducer, middlewareStack) => {
  middlewareStack.unshift(originalReducer);
  const lastReducer = middlewareStack.reduce((last, middleware) => {
    return middleware(last);
  });
  return lastReducer;
};

export default withMiddleware;
