import { itemAttributes } from "../../configuration/theme";
import calculateMaxHeight from "../height";

describe("Setup to test the calculateMaxHeight helper function", () => {
  const inputs = [200, 300, 400, 500, 600, 700, 800, 900];

  const testcase = (input) => {
    it(`with a window height of: ${input} it should return a valid height value`, () => {
      window.innerHeight = input;
      const value = calculateMaxHeight();
      const number_of_elements =
        (value + itemAttributes.padding - itemAttributes.border * 2) /
        itemAttributes.height;
      expect(Math.abs(number_of_elements)).toBe(number_of_elements);
      expect(number_of_elements * itemAttributes.innerHeight).toBeLessThan(
        input
      );
    });
  };

  for (const input of inputs) {
    testcase(input);
  }
});
