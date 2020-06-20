import { itemAttributes } from "../configuration/theme";

const calculateMaxHeight = () => {
  const height = window.innerHeight;
  return (
    Math.floor(height / 2 / itemAttributes.height) * itemAttributes.height -
    itemAttributes.height +
    itemAttributes.border * 2 -
    itemAttributes.padding
  );
};

export default calculateMaxHeight;
