import { act } from "@testing-library/react";

const mockRegistration = {
  waiting: {
    postMessage: jest.fn(),
  },
};

describe("test performUpdate", () => {
  let performUpdateFn;

  beforeEach(async () => {
    document.body.innerHTML = "";
    const div = document.createElement("div");
    div.id = "root";
    document.body.appendChild(div);

    await act(async () => {
      let { performUpdate } = require("../index.js");
      performUpdateFn = performUpdate;
    });
  });

  describe("when the update confirmation is accepted", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(global, "confirm").mockImplementation(() => true);
      delete window.location;
      window.location = { ...window.location, reload: jest.fn() };
    });

    it("when perform update is called without a waiting object it should not reload the page and not post the message", () => {
      performUpdateFn(mockRegistration);
      expect(mockRegistration.waiting.postMessage).toBeCalledWith({
        type: "SKIP_WAITING",
      });
      expect(window.location.reload).toBeCalledTimes(1);
    });

    it("when perform update is called without a proper registration, it should not post the SKIP_WAITING message and not reload the page", () => {
      performUpdateFn({});
      expect(mockRegistration.waiting.postMessage).toBeCalledTimes(0);
      expect(window.location.reload).toBeCalledTimes(0);
    });
  });

  describe("when the update confirmation is not accepted", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(global, "confirm").mockImplementation(() => false);
    });

    it("should not perform updates", () => {
      performUpdateFn(mockRegistration);
      expect(mockRegistration.waiting.postMessage).toBeCalledTimes(0);
      expect(window.location.reload).toBeCalledTimes(0);
    });
  });
});
