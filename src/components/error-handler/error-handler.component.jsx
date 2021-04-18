import React from "react";
import ErrorDialogue from "../error-dialogue/error-dialogue.component";
import PropTypes from "prop-types";

const ErrorHandler = ({ condition, children, ...otherProps }) => {
  if (!condition) return children;
  return <ErrorDialogue {...otherProps} />;
};

export default ErrorHandler;

ErrorHandler.propTypes = {
  condition: PropTypes.bool.isRequired,
  clearError: PropTypes.func.isRequired,
  eventMessage: PropTypes.object,
  messageTranslationKey: PropTypes.string.isRequired,
  redirect: PropTypes.string,
};
