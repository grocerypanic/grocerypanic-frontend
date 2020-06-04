import React from "react";

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
