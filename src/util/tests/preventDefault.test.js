import preventContext from "../preventDefault";

describe("Setup to test the preventDefault helper function", () => {
  it("should call preventdefault on a passed object", () => {
    const mockEvent = {
      preventDefault: jest.fn(),
    };

    preventContext(mockEvent);

    expect(mockEvent.preventDefault).toBeCalledTimes(1);
    expect(mockEvent.preventDefault).toBeCalledWith();
  });
});
