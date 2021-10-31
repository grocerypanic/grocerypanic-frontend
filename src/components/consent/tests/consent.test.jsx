import { render, cleanup } from "@testing-library/react";
import cookie from "cookie_js";
import React from "react";
import CookieConsent from "react-cookie-consent";
import { Constants } from "../../../configuration/backend";
import Strings from "../../../configuration/strings";
import { AnalyticsContext } from "../../../providers/analytics/analytics.provider";
import Consent from "../consent.component";

jest.mock("react-cookie-consent", () =>
  jest.fn(() => <div>MockConsentComponent</div>)
);

const mockSetup = jest.fn();
const mockAnalyticsSettings = {
  event: null,
  initialized: true,
  setup: mockSetup,
};

describe("Check Error Rendering", () => {
  describe("Without a consent cookie present", () => {
    beforeEach(() => {
      cookie.remove(Constants.AnalyticsCookieName);
      mockSetup.mockClear();
      CookieConsent.mockClear();
      render(
        <AnalyticsContext.Provider value={mockAnalyticsSettings}>
          <Consent />
        </AnalyticsContext.Provider>
      );
    });

    afterEach(cleanup);

    it("renders with the consent dialogue", () => {
      expect(CookieConsent).toHaveBeenCalledTimes(1);
      const props = CookieConsent.mock.calls[0][0];
      expect(props.acceptOnScroll).toBeFalsy();
      expect(props.children).toBe(Strings.CookiePolicy.CookieMessage);
      expect(props.onAccept).toBe(mockSetup);
    });

    it("setup should not be called", () => {
      expect(mockSetup).toHaveBeenCalledTimes(0);
    });
  });

  describe("With a consent cookie present", () => {
    beforeEach(() => {
      cookie.set(Constants.AnalyticsCookieName, "true");
      mockSetup.mockClear();
      CookieConsent.mockClear();
      render(
        <AnalyticsContext.Provider value={mockAnalyticsSettings}>
          <Consent />
        </AnalyticsContext.Provider>
      );
    });

    afterEach(cleanup);

    it("renders without the consent dialogue", () => {
      expect(CookieConsent).toHaveBeenCalledTimes(0);
    });

    it("setup should not be called", () => {
      expect(mockSetup).toHaveBeenCalledTimes(1);
    });
  });
});
