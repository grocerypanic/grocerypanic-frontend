// Composition Function to Wrap Reducers With Custom Middlewares

const withMiddleware = (originalReducer, middlewarestack) => {
  middlewarestack.unshift(originalReducer);
  const lastReducer = middlewarestack.reduce((last, middleware) => {
    return middleware(last);
  });
  return lastReducer;
};

export default withMiddleware;
