import { render, within, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import Strings from "../../../configuration/strings";
import ProfileForm, { nullFunction } from "../profile.edit.form.component";

jest.mock("../../../configuration/theme", () => {
  return {
    ...jest.requireActual("../../../configuration/theme"),
    ui: {
      alertTimeout: 10,
    },
  };
});

const mockUser = {
  first_name: "Niall",
  last_name: "Byrne",
  timezone: "mockTime1",
  id: 0,
  has_profile_initialized: false,
};

const props = {
  user: [mockUser],
  title: "MockTitle",
  helpText: "MockHelpText",
  transaction: false,
  timezones: [
    { id: 0, name: "mockTime1" },
    { id: 1, name: "mockTime2" },
  ],
  handleSave: jest.fn(),
};

let utils;

describe("Setup Environment for ProfileForm test", () => {
  let currentProps;
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderHelper = (currentProps, command = render) => {
    utils = command(<ProfileForm {...currentProps} />);
  };

  describe("outside of a transaction", () => {
    describe("with a valid timezone", () => {
      beforeEach(async () => {
        currentProps = { ...props };
        currentProps.transaction = false;
        renderHelper(currentProps);
      });

      it("should match the snapshot on file (styles)", () => {
        expect(utils.container).toMatchSnapshot();
      });

      it("populates the hint dialogue correctly", () => {
        utils.getByText(currentProps.helpText);
      });

      it("populates the first name correctly", () => {
        const element = utils.getByTestId("input_first_name");
        expect(element.value).toBe(mockUser.first_name);
      });

      it("populates the last name correctly", () => {
        const element = utils.getByTestId("input_last_name");
        expect(element.value).toBe(mockUser.last_name);
      });

      it("populates timezone correctly", () => {
        const element = utils.getByTestId("input_timezone_parent");
        const dropdown = element.firstChild.querySelector(
          ".list__dropdown-indicator"
        );
        fireEvent.mouseDown(dropdown, "click");
        const menu = within(element.firstChild.querySelector(".list__menu"));

        menu.getByText(currentProps.timezones[0].name);
        menu.getByText(currentProps.timezones[1].name);
      });

      it("creates the button correctly", () => {
        const element = utils.getByTestId("submit");
        expect(element.innerHTML).toBe(Strings.Profile.SaveButton);
        expect(element).toHaveClass("btn-success");
      });

      it("handles save as expected correctly, valid data", async () => {
        const alert = within(utils.getByTestId("alert"));
        expect(alert.queryByText(Strings.Profile.SaveAction)).toBeNull();

        const element = utils.getByTestId("submit");
        fireEvent.click(element, "click");

        expect(currentProps.handleSave).toBeCalledTimes(1);
        expect(currentProps.handleSave).toBeCalledWith({
          ...mockUser,
          has_profile_initialized: true,
        });

        expect(alert.queryByText(Strings.Profile.SaveAction)).toBeTruthy();
        await waitFor(() =>
          expect(alert.queryByText(Strings.Profile.SaveAction)).toBeNull()
        );
      });
    });
  });
  describe("during a transaction", () => {
    beforeEach(async () => {
      currentProps = { ...props };
      currentProps.transaction = true;
      renderHelper(currentProps);
    });

    it("should match the snapshot on file (styles)", () => {
      expect(utils.container).toMatchSnapshot();
    });

    it("creates the button correctly", () => {
      const element = utils.getByTestId("submit");
      expect(element.innerHTML).toBe(Strings.Profile.SaveButton);
      expect(element).toHaveClass("btn-secondary");
    });

    it("handles save as expected correctly", () => {
      const alert = within(utils.getByTestId("alert"));
      expect(alert.queryByText(Strings.Profile.SaveAction)).toBeNull();

      const element = utils.getByTestId("submit");
      fireEvent.click(element, "click");

      expect(currentProps.handleSave).toBeCalledTimes(0);
    });
  });
});

describe("Setup Environment for nullFunction test", () => {
  it("should be a noop", () => {
    nullFunction();
  });
});
