import React from "react";
import { render, cleanup } from "@testing-library/react";
import i18next from "i18next";
import matchMediaPolyfill from "mq-polyfill";

import SpashPage from "../splash.page";
import FeedBack from "../../../components/feedback/feedback.component";
import Dialogue from "../../../components/dialogue/dialogue.component";

import { mobileThreshold } from "../../../configuration/theme";

import { HeaderContext } from "../../../providers/header/header.provider";
import initialHeaderSettings from "../../../providers/header/header.initial";

import Strings from "../../../configuration/strings";

matchMediaPolyfill(window);

jest.mock("../../../components/dialogue/dialogue.component");
jest.mock("../../../components/feedback/feedback.component");
Dialogue.mockImplementation(() => <div>MockDialogue</div>);
FeedBack.mockImplementation(() => <div>MockFeedBack</div>);

const mockHeaderUpdate = jest.fn();

window.resizeTo = function resizeTo(width, height) {
  Object.assign(this, {
    innerWidth: width,
    innerHeight: height,
    outerWidth: width,
    outerHeight: height,
  }).dispatchEvent(new this.Event("resize"));
};

describe("Check the correct props are passed to ", () => {
  let utils;
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const checkHeader = () => {
    expect(mockHeaderUpdate).toBeCalledWith({
      title: "MainHeaderTitle",
      signIn: true,
    });
    expect(i18next.t("MainHeaderTitle")).toBe(Strings.MainHeaderTitle);
  };

  const renderHelper = (props) => {
    return (utils = render(
      <HeaderContext.Provider
        value={{ ...initialHeaderSettings, updateHeader: mockHeaderUpdate }}
      >
        <SpashPage />
      </HeaderContext.Provider>
    ));
  };

  afterEach(cleanup);

  describe("in mobile mode", () => {
    beforeEach(() => {
      window.resizeTo(mobileThreshold - 50, 600);
      utils = renderHelper();
    });

    it("should call the header as expected", () => {
      checkHeader();
    });

    it("should render slide 1 as expected", async () => {
      expect(utils.getByText(Strings.SplashPage.Slide1.header)).toBeTruthy();
      expect(utils.getByText(Strings.SplashPage.Slide1.text1)).toBeTruthy();
      expect(utils.getByAltText(Strings.SplashPage.Slide1.alt)).toBeTruthy();
    });

    it("should render slide 2 as expected", async () => {
      expect(utils.getByText(Strings.SplashPage.Slide2.header)).toBeTruthy();
      expect(utils.getByText(Strings.SplashPage.Slide2.text1)).toBeTruthy();
      expect(utils.getByAltText(Strings.SplashPage.Slide2.alt)).toBeTruthy();
    });

    it("should match the snapshot on file (styles)", () => {
      expect(utils.container).toMatchSnapshot();
    });
  });

  describe("in desktop mode", () => {
    beforeEach(() => {
      window.resizeTo(800, 600);
      utils = renderHelper();
    });

    it("should call the header as expected", () => {
      checkHeader();
    });

    it("should render slide 1 as expected", async () => {
      expect(utils.getByText(Strings.SplashPage.Slide1.header)).toBeTruthy();
      expect(utils.getByText(Strings.SplashPage.Slide1.text1)).toBeTruthy();
      expect(utils.getByAltText(Strings.SplashPage.Slide1.alt)).toBeTruthy();
    });

    it("should render slide 2 as expected", async () => {
      expect(utils.getByText(Strings.SplashPage.Slide2.header)).toBeTruthy();
      expect(utils.getByText(Strings.SplashPage.Slide2.text1)).toBeTruthy();
      expect(utils.getByAltText(Strings.SplashPage.Slide2.alt)).toBeTruthy();
    });

    it("should match the snapshot on file (styles)", () => {
      expect(utils.container).toMatchSnapshot();
    });
  });
});
