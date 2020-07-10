import ApiActions from "./api.actions";

export const authFailure = (dispatch, callback) => {
  new Promise((resolve) => {
    dispatch({ type: ApiActions.FailureAuth, callback });
  });
};

export const duplicateObject = (dispatch, callback) => {
  new Promise((resolve) => {
    dispatch({ type: ApiActions.DuplicateObject, callback });
  });
};

export const asyncDispatch = (dispatch, action) => {
  new Promise((resolve) => {
    dispatch(action);
  });
};
