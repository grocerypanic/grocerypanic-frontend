import { useContext } from "react";
import { TimezoneContext } from "./timezone.provider";
import ApiActions from "../api.actions";
import ApiFunctions from "../api.functions";

const useTimezones = () => {
  const { apiObject, dispatch } = useContext(TimezoneContext);

  const getTimezones = () => {
    dispatch({
      type: ApiActions.StartList,
      func: ApiFunctions.asyncList,
      dispatch: dispatch,
    });
  };
  const clearErrors = () => dispatch({ type: ApiActions.ClearErrors });

  return {
    timezones: {
      timezones: apiObject,
      clearErrors,
      getTimezones,
    },
  };
};

export default useTimezones;
