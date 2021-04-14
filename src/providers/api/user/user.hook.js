import { useContext } from "react";
import { UserContext } from "./user.provider";
import ApiActions from "../api.actions";

const useProfile = () => {
  const { apiObject, dispatch } = useContext(UserContext);

  const getProfile = () => dispatch({ type: ApiActions.StartGet });
  const updateProfile = (profileData) =>
    dispatch({
      type: ApiActions.StartUpdate,
      action: { payload: profileData },
    });

  return {
    user: apiObject,
    getProfile,
    updateProfile,
  };
};

export default useProfile;
