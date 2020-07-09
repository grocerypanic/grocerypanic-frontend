import ApiActions from "./api.actions";

export const authFailure = (dispatch, callback) => {
  return new Promise(function (resolve) {
    dispatch({ type: ApiActions.FailureAuth, callback });
  });
};

export const duplicateObject = (dispatch, callback) => {
  return new Promise(function (resolve) {
    dispatch({ type: ApiActions.DuplicateObject, callback });
  });
};
