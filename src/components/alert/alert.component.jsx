import React from "react";
import Assets from "../../configuration/assets";
import PropTypes from "prop-types";

import { AlertContainer } from "./alert.styles";

const Alert = ({ message }) => (
  <AlertContainer>
    <div data-testid="alert" className="alert alert-light" role="alert">
      {message ? message : Assets.nonBreakingSpace}
    </div>
  </AlertContainer>
);

export default Alert;

Alert.propTypes = {
  message: PropTypes.string, // This should be a translated string
};
