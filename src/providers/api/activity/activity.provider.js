import React, { useReducer, createContext } from "react";
import InitialState from "./activity.initial";
import ActivityReducer from "./activity.reducer";

export const ActivityContext = createContext({ ...InitialState });

const ActivityProvider = ({ children }) => {
  const [activity, dispatch] = useReducer(ActivityReducer, InitialState);

  return (
    <ActivityContext.Provider
      value={{
        apiObject: activity,
        dispatch,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export default ActivityProvider;
