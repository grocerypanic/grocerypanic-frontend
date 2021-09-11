import React from "react";
import Spinner from "react-bootstrap/Spinner";
import { CenterBox } from "./holding-pattern.styles";
import { HeaderContext } from "../../providers/header/header.provider";

const HoldingPattern = ({
  condition,
  children,
  color = "success",
  animation = "grow",
  height = "80vh",
  scale = 3,
  divWidth = 75,
  divHeight = 75,
}) => {
  const { updateHeader } = React.useContext(HeaderContext);

  React.useEffect(() => {
    if (!condition) return;
    updateHeader({
      disableNav: true,
    });
  }, []); // eslint-disable-line

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
