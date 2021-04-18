import { useContext } from "react";
import { UserContext } from "./user.provider";
import ApiActions from "../api.actions";
import ApiFunctions from "../api.functions";

const useProfile = () => {
  const { apiObject, dispatch } = useContext(UserContext);

  const getProfile = () => {
    dispatch({
      type: ApiActions.StartGet,
      func: ApiFunctions.asyncGet,
      dispatch: dispatch,
    });
  };

  const updateProfile = (profileData) =>
    dispatch({
      type: ApiActions.StartUpdate,
      func: ApiFunctions.asyncUpdate,
      dispatch: dispatch,
      payload: profileData,
    });

  const clearErrors = () => dispatch({ type: ApiActions.ClearErrors });

  return {
    profile: {
      user: apiObject,
      clearErrors,
      getProfile,
      updateProfile,
    },
  };
};

export default useProfile;
