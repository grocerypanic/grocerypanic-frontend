import React from "react";
import Spinner from "react-bootstrap/Spinner";

import { CenterBox } from "./holding-pattern.styles";

const HoldingPattern = ({ condition, children }) => {
  if (!condition) return children;
  return (
    <CenterBox data-testid="HoldingPattern">
      <div style={{ width: 75 }}>
        <Spinner
          animation="grow"
          variant="success"
          className="kindly-hang-in-there"
        />
      </div>
    </CenterBox>
  );
};

export default HoldingPattern;
