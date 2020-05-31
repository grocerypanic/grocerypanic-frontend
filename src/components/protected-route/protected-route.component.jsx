import React from "react";
import { withRouter } from "react-router-dom";

import { Route } from "react-router-dom";
import { UserContext } from "../../providers/user/user.provider";

const ProtectedRoute = ({
  negative,
  attr,
  redirect,
  history,
  ...otherProps
}) => {
  const { user } = React.useContext(UserContext);

  React.useEffect(() => {
    if (negative && !user[attr]) {
      history.push(redirect);
    }
    if (!negative && user[attr]) {
      history.push(redirect);
    }
  }, [user]);

  return <Route {...otherProps} />;
};

export default withRouter(ProtectedRoute);
