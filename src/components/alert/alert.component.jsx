import PropTypes from "prop-types";
import React from "react";
import { AlertContainer } from "./alert.styles";
import Assets from "../../configuration/assets";

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
