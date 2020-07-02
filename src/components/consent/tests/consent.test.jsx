import React from "react";
import { render, cleanup } from "@testing-library/react";
import CookieConsent from "react-cookie-consent";
import cookie from "cookie_js";

import { AnalyticsContext } from "../../../providers/analytics/analytics.provider";

import Consent, { AnalyticsCookieName } from "../consent.component";

import Strings from "../../../configuration/strings";

jest.mock("react-cookie-consent");

const mockSetup = jest.fn();
const mockAnalyticsSettings = {
  event: null,
  initialized: true,
  setup: mockSetup,
};

describe("Check Error Rendering", () => {
  let utils;

  describe("Without a consent cookie present", () => {
    beforeEach(() => {
      cookie.remove(AnalyticsCookieName);
      mockSetup.mockClear();
      CookieConsent.mockClear();
      utils = render(
        <AnalyticsContext.Provider value={mockAnalyticsSettings}>
          <Consent />
        </AnalyticsContext.Provider>
      );
    });

    afterEach(cleanup);

    it("renders with expected elements", () => {
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
      cookie.set(AnalyticsCookieName, "true");
      mockSetup.mockClear();
      CookieConsent.mockClear();
      utils = render(
        <AnalyticsContext.Provider value={mockAnalyticsSettings}>
          <Consent />
        </AnalyticsContext.Provider>
      );
    });

    afterEach(cleanup);

    it("renders with expected elements", () => {
      expect(CookieConsent).toHaveBeenCalledTimes(0);
    });

    it("setup should not be called", () => {
      expect(mockSetup).toHaveBeenCalledTimes(1);
    });
  });
});
