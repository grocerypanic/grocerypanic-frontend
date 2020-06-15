import React from "react";
import Spinner from "react-bootstrap/Spinner";

import { CenterBox } from "./holding-pattern.styles";

const HoldingPattern = ({ condition, children }) => {
  if (!condition) return children;
  return (
    <CenterBox>
      <Spinner
        animation="grow"
        variant="success"
        className="kindly-hang-in-there"
      />
    </CenterBox>
  );
};

export default HoldingPattern;
