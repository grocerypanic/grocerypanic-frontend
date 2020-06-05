import React from "react";
import PropTypes from "prop-types";

import { ListDialogue, Centered } from "./simple-list-help.styles.jsx";

const Help = ({ children }) => {
  return (
    <ListDialogue data-testid="ListDialogue">
      {children.split("\n").map((item, index) => {
        return <Centered key={index}>{item}</Centered>;
      })}
    </ListDialogue>
  );
};

export default Help;

Help.propTypes = {
  children: PropTypes.string.isRequired,
};
