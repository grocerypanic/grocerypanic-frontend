import PropTypes from "prop-types";
import React from "react";
import { ListDialogue, Centered } from "./hint.styles.jsx";

const Hint = ({ children }) => {
  return (
    <ListDialogue data-testid="HintDialogue">
      {children.split("\n").map((item, index) => {
        return <Centered key={index}>{item}</Centered>;
      })}
    </ListDialogue>
  );
};

export default Hint;

Hint.propTypes = {
  children: PropTypes.string.isRequired,
};
