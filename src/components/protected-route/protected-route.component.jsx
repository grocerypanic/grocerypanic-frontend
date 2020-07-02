import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

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

  const handleRedirect = () => {
    if (negative && !user[attr]) {
      history.push(redirect);
    }
    if (!negative && user[attr]) {
      history.push(redirect);
    }
  };

  React.useEffect(() => {
    handleRedirect();
  }, [user]); // eslint-disable-line

  React.useEffect(() => {
    handleRedirect();
  }, []); // eslint-disable-line

  return <Route {...otherProps} />;
};

export default withRouter(ProtectedRoute);

ProtectedRoute.propTypes = {
  attr: PropTypes.string.isRequired,
  negative: PropTypes.bool,
  redirect: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
