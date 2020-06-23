import React from "react";
import Spinner from "react-bootstrap/Spinner";

import { CenterBox } from "./holding-pattern.styles";

const HoldingPattern = ({
  condition,
  children,
  color = "success",
  animation = "grow",
  height = "100vh",
  scale = 3,
  divWidth = 75,
  divHeight = 75,
}) => {
  if (!condition) return children;
  return (
    <CenterBox scale={scale} height={height} data-testid="HoldingPattern">
      <div style={{ width: divWidth, height: divHeight }}>
        <Spinner
          animation={animation}
          variant={color}
          className="kindly-hang-in-there"
        />
      </div>
    </CenterBox>
  );
};

export default HoldingPattern;
