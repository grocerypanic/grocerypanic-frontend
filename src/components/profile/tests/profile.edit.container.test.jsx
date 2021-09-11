import { render, act } from "@testing-library/react";
import React from "react";
import { AnalyticsActions } from "../../../providers/analytics/analytics.actions";
import { AnalyticsContext } from "../../../providers/analytics/analytics.provider";
import ApiActions from "../../../providers/api/api.actions";
import mockTimezoneHook from "../../../providers/api/timezone/tests/timezone.hook.mock";
import useTimezones from "../../../providers/api/timezone/timezone.hook";
import mockProfileHook from "../../../providers/api/user/tests/user.hook.mock";
import useProfile from "../../../providers/api/user/user.hook";
import initialHeaderSettings from "../../../providers/header/header.initial";
import { HeaderContext } from "../../../providers/header/header.provider";
import useSocialLogin from "../../../providers/social/social.hook";
import mockSocialHook from "../../../providers/social/tests/social.hook.mock";
import { propCount } from "../../../test.fixtures/objectComparison";
import ErrorHandler from "../../error-handler/error-handler.component";
import HoldingPattern from "../../holding-pattern/holding-pattern.component";
import ProfileEditContainer from "../profile.edit.container";
import ProfileForm from "../profile.edit.form.component";

jest.mock("../profile.edit.form.component");
jest.mock("../../../providers/social/social.hook");
jest.mock("../../../providers/api/user/user.hook");
jest.mock("../../../providers/api/timezone/timezone.hook");
jest.mock("../../error-handler/error-handler.component");
jest.mock("../../holding-pattern/holding-pattern.component");

ProfileForm.mockImplementation(() => <div>MockForm</div>);
ErrorHandler.mockImplementation(({ children }) => children);
HoldingPattern.mockImplementation(({ children }) => children);

const mockAnalyticsContext = {
  initialized: true,
  event: jest.fn(),
  setup: true,
};

const mockHeaderContext = {
  ...initialHeaderSettings,
  updateHeader: jest.fn(),
};

const props = {
  headerTitle: "mockHeaderTitle",
  title: "mockTitle",
  helpText: "mockHelpText",
};

let utils;
let currentSocialHook;
let currentProfileHook;
let currentTimezoneHook;
let currentProps;

describe("Setup Environment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    currentProps = { ...props };
    currentSocialHook = mockSocialHook();
    currentProfileHook = mockProfileHook();
    currentTimezoneHook = mockTimezoneHook();
  });

  const renderHelper = (currentProps, command = render) => {
    utils = command(
      <AnalyticsContext.Provider value={mockAnalyticsContext}>
        <HeaderContext.Provider value={mockHeaderContext}>
          <ProfileEditContainer {...currentProps} />
        </HeaderContext.Provider>
      </AnalyticsContext.Provider>
    );
  };

  const setupHooks = () => {
    useSocialLogin.mockImplementation(() => currentSocialHook);
    useProfile.mockImplementation(() => currentProfileHook);
    useTimezones.mockImplementation(() => currentTimezoneHook);
  };

  describe("outside of an error", () => {
    beforeEach(() => {
      currentProfileHook.profile.user.fail = false;
    });

    describe("with a valid user profile loaded", () => {
      beforeEach(() => {
        currentProfileHook.profile.user.inventory = ["mockData"];
      });

      describe("outside of a transaction", () => {
        beforeEach(() => {
          currentProfileHook.profile.user.transaction = false;
          setupHooks();
          renderHelper(currentProps);
        });

        it("should match the snapshot on file (styles)", () => {
          expect(utils.container).toMatchSnapshot();
        });

        it("renders, calls the expected hooks", () => {
          expect(currentProfileHook.profile.getProfile).toBeCalledTimes(1);
          expect(currentTimezoneHook.timezones.getTimezones).toBeCalledTimes(1);
        });

        it("renders, should call ErrorHandler with the correct params", () => {
          expect(ErrorHandler).toHaveBeenCalledTimes(1);
          const call = ErrorHandler.mock.calls[0][0];
          propCount(call, 5);
          expect(call.condition).toBeFalsy();
          expect(call.clearError).toBe(currentProfileHook.profile.clearErrors);
          expect(call.eventMessage).toBe(AnalyticsActions.ApiError);
          expect(call.messageTranslationKey).toBe("Profile.ApiError");
          expect(call.children).not.toBeNull();
        });

        it("renders, should call HoldingPattern with the correct params", () => {
          expect(HoldingPattern).toHaveBeenCalledTimes(1);
          const call = HoldingPattern.mock.calls[0][0];
          propCount(call, 2);
          expect(call.condition).toBeTruthy();
          expect(call.children).not.toBeNull();
        });

        it("renders, should call updateHeader with the correct params", () => {
          expect(mockHeaderContext.updateHeader).toHaveBeenCalledTimes(1);
          expect(mockHeaderContext.updateHeader).toBeCalledWith({
            title: currentProps.headerTitle,
            create: null,
            transaction: false,
            disableNav: false,
          });
        });

        it("renders, should call ProfileEditFrom with the correct params", () => {
          expect(ProfileForm).toHaveBeenCalledTimes(1);
          const call = ProfileForm.mock.calls[0][0];
          propCount(call, 6);
          expect(call.user).toBe(currentProfileHook.profile.user.inventory);
          expect(call.title).toBe(currentProps.title);
          expect(call.helpText).toBe(currentProps.helpText);
          expect(call.transaction).toBe(
            currentProfileHook.profile.user.transaction
          );
          expect(call.handleSave).toBeInstanceOf(Function);
          expect(call.timezones).toBe(
            currentTimezoneHook.timezones.timezones.inventory
          );
        });

        it("renders, saves profile data correctly", async () => {
          expect(ProfileForm).toHaveBeenCalledTimes(1);
          const call = ProfileForm.mock.calls[0][0];
          const save = call.handleSave;
          const mockObject = { id: 0, name: "mockObect" };

          await act(async () => save(mockObject));

          expect(mockAnalyticsContext.event).toBeCalledWith(
            AnalyticsActions.ProfileModified
          );
          expect(currentProfileHook.profile.updateProfile).toBeCalledWith(
            mockObject
          );
        });
      });

      describe("during a user transaction", () => {
        beforeEach(() => {
          currentProfileHook.profile.user.inventory = [];
          currentProfileHook.profile.user.transaction = true;
          currentTimezoneHook.timezones.timezones.transaction = false;
          setupHooks();
          renderHelper(currentProps);
        });

        it("renders, calls the expected hooks", () => {
          expect(currentProfileHook.profile.getProfile).toBeCalledTimes(1);
          expect(currentTimezoneHook.timezones.getTimezones).toBeCalledTimes(1);
        });

        it("renders, should call ErrorHandler with the correct params", () => {
          expect(ErrorHandler).toHaveBeenCalledTimes(1);
          const call = ErrorHandler.mock.calls[0][0];
          propCount(call, 5);
          expect(call.condition).toBeFalsy();
          expect(call.clearError).toBe(currentProfileHook.profile.clearErrors);
          expect(call.eventMessage).toBe(AnalyticsActions.ApiError);
          expect(call.messageTranslationKey).toBe("Profile.ApiError");
          expect(call.children).not.toBeNull();
        });

        it("renders, should call HoldingPattern with the correct params", () => {
          expect(HoldingPattern).toHaveBeenCalledTimes(1);
          const call = HoldingPattern.mock.calls[0][0];
          propCount(call, 2);
          expect(call.condition).toBeTruthy();
          expect(call.children).not.toBeNull();
        });

        it("renders, should call updateHeader with the correct params", () => {
          expect(mockHeaderContext.updateHeader).toHaveBeenCalledTimes(1);
          expect(mockHeaderContext.updateHeader).toBeCalledWith({
            title: currentProps.headerTitle,
            create: null,
            transaction: true,
            disableNav: false,
          });
        });

        it("renders, should call ProfileEditFrom with the correct params", () => {
          expect(ProfileForm).toHaveBeenCalledTimes(1);
          const call = ProfileForm.mock.calls[0][0];
          propCount(call, 6);
          expect(call.user).toBe(currentProfileHook.profile.user.inventory);
          expect(call.title).toBe(currentProps.title);
          expect(call.helpText).toBe(currentProps.helpText);
          expect(call.transaction).toBe(
            currentProfileHook.profile.user.transaction
          );
          expect(call.handleSave).toBeInstanceOf(Function);
          expect(call.timezones).toBe(
            currentTimezoneHook.timezones.timezones.inventory
          );
        });

        it("renders, does not save profile data when asked", async () => {
          expect(ProfileForm).toHaveBeenCalledTimes(1);
          const call = ProfileForm.mock.calls[0][0];
          const save = call.handleSave;
          const mockObject = { id: 0, name: "mockObect" };

          await act(async () => save(mockObject));
          expect(mockAnalyticsContext.event).toBeCalledTimes(0);
          expect(currentProfileHook.profile.updateProfile).toBeCalledTimes(0);
        });
      });

      describe("during a timezone transaction", () => {
        beforeEach(() => {
          currentTimezoneHook.timezones.timezones.inventory = [];
          currentTimezoneHook.timezones.timezones.transaction = true;
          currentProfileHook.profile.user.transaction = false;
          setupHooks();
          renderHelper(currentProps);
        });

        it("renders, calls the expected hooks", () => {
          expect(currentProfileHook.profile.getProfile).toBeCalledTimes(1);
          expect(currentTimezoneHook.timezones.getTimezones).toBeCalledTimes(1);
        });

        it("renders, should call ErrorHandler with the correct params", () => {
          expect(ErrorHandler).toHaveBeenCalledTimes(1);
          const call = ErrorHandler.mock.calls[0][0];
          propCount(call, 5);
          expect(call.condition).toBeFalsy();
          expect(call.clearError).toBe(currentProfileHook.profile.clearErrors);
          expect(call.eventMessage).toBe(AnalyticsActions.ApiError);
          expect(call.messageTranslationKey).toBe("Profile.ApiError");
          expect(call.children).not.toBeNull();
        });

        it("renders, should call HoldingPattern with the correct params", () => {
          expect(HoldingPattern).toHaveBeenCalledTimes(1);
          const call = HoldingPattern.mock.calls[0][0];
          propCount(call, 2);
          expect(call.condition).toBeTruthy();
          expect(call.children).not.toBeNull();
        });

        it("renders, should call updateHeader with the correct params", () => {
          expect(mockHeaderContext.updateHeader).toHaveBeenCalledTimes(1);
          expect(mockHeaderContext.updateHeader).toBeCalledWith({
            title: currentProps.headerTitle,
            create: null,
            transaction: true,
            disableNav: false,
          });
        });

        it("renders, should call ProfileEditFrom with the correct params", () => {
          expect(ProfileForm).toHaveBeenCalledTimes(1);
          const call = ProfileForm.mock.calls[0][0];
          propCount(call, 6);
          expect(call.user).toBe(currentProfileHook.profile.user.inventory);
          expect(call.title).toBe(currentProps.title);
          expect(call.helpText).toBe(currentProps.helpText);
          expect(call.transaction).toBe(
            currentProfileHook.profile.user.transaction
          );
          expect(call.handleSave).toBeInstanceOf(Function);
          expect(call.timezones).toBe(
            currentTimezoneHook.timezones.timezones.inventory
          );
        });

        it("renders, does not save profile data when asked", async () => {
          expect(ProfileForm).toHaveBeenCalledTimes(1);
          const call = ProfileForm.mock.calls[0][0];
          const save = call.handleSave;
          const mockObject = { id: 0, name: "mockObject" };

          await act(async () => save(mockObject));
          expect(mockAnalyticsContext.event).toBeCalledTimes(0);
          expect(currentProfileHook.profile.updateProfile).toBeCalledTimes(0);
        });
      });
    });

    describe("with timezones already loaded", () => {
      beforeEach(() => {
        currentProfileHook.profile.user.transaction = false;
        currentTimezoneHook.timezones.timezones.inventory = [
          { id: 1, name: "fake timezone" },
        ];
        setupHooks();
        renderHelper(currentProps);
      });

      it("renders, does not refetch the timezones", () => {
        expect(currentProfileHook.profile.getProfile).toBeCalledTimes(1);
        expect(currentTimezoneHook.timezones.getTimezones).toBeCalledTimes(0);
      });
    });

    describe("without a valid user profile loaded", () => {
      beforeEach(() => {
        currentProfileHook.profile.user.inventory = [];
        currentProfileHook.profile.user.transaction = false;
        setupHooks();
        renderHelper(currentProps);
      });

      it("renders, should call ErrorHandler with the correct params", () => {
        expect(ErrorHandler).toHaveBeenCalledTimes(1);
        const call = ErrorHandler.mock.calls[0][0];
        propCount(call, 5);
        expect(call.condition).toBeFalsy();
        expect(call.clearError).toBe(currentProfileHook.profile.clearErrors);
        expect(call.eventMessage).toBe(AnalyticsActions.ApiError);
        expect(call.messageTranslationKey).toBe("Profile.ApiError");
        expect(call.children).not.toBeNull();
      });

      it("renders, should call HoldingPattern with the correct params", () => {
        expect(HoldingPattern).toHaveBeenCalledTimes(1);
        const call = HoldingPattern.mock.calls[0][0];
        propCount(call, 2);
        expect(call.condition).toBeTruthy();
        expect(call.children).not.toBeNull();
      });
    });
  });

  describe("during an error", () => {
    describe("during an user api transaction failure", () => {
      beforeEach(() => {
        currentProfileHook.profile.user.fail = true;
        currentProfileHook.profile.user.transaction = false;
        setupHooks();
        renderHelper(currentProps);
      });

      it("renders, should call ErrorHandler with the correct params", () => {
        expect(ErrorHandler).toHaveBeenCalledTimes(1);
        const call = ErrorHandler.mock.calls[0][0];
        propCount(call, 5);
        expect(call.condition).toBeTruthy();
        expect(call.clearError).toBe(currentProfileHook.profile.clearErrors);
        expect(call.eventMessage).toBe(AnalyticsActions.ApiError);
        expect(call.messageTranslationKey).toBe("Profile.ApiError");
        expect(call.children).not.toBeNull();
      });
    });

    describe("during an timezone api transaction failure", () => {
      beforeEach(() => {
        currentTimezoneHook.timezones.timezones.fail = true;
        currentTimezoneHook.timezones.timezones.transaction = false;
        setupHooks();
        renderHelper(currentProps);
      });

      it("renders, should call ErrorHandler with the correct params", () => {
        expect(ErrorHandler).toHaveBeenCalledTimes(1);
        const call = ErrorHandler.mock.calls[0][0];
        propCount(call, 5);
        expect(call.condition).toBeTruthy();
        expect(call.clearError).toBe(currentProfileHook.profile.clearErrors);
        expect(call.eventMessage).toBe(AnalyticsActions.ApiError);
        expect(call.messageTranslationKey).toBe("Profile.ApiError");
        expect(call.children).not.toBeNull();
      });
    });

    describe("during a user authentication failure", () => {
      beforeEach(() => {
        currentProfileHook.profile.user.fail = true;
        currentProfileHook.profile.user.errorMessage = ApiActions.FailureAuth;
        setupHooks();
        renderHelper(currentProps);
      });

      it("renders, should call ErrorHandler with the correct params", () => {
        expect(currentSocialHook.social.expiredAuth).toHaveBeenCalledTimes(1);
      });
    });

    describe("during a timezones authentication failure", () => {
      beforeEach(() => {
        currentTimezoneHook.timezones.timezones.fail = true;
        currentTimezoneHook.timezones.timezones.errorMessage =
          ApiActions.FailureAuth;
        setupHooks();
        renderHelper(currentProps);
      });

      it("renders, should call ErrorHandler with the correct params", () => {
        expect(currentSocialHook.social.expiredAuth).toHaveBeenCalledTimes(1);
      });
    });
  });
});
