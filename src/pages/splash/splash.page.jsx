import React from "react";
import { Carousel } from "react-bootstrap";

import { HeaderContext } from "../../providers/header/header.provider";
import { useTranslation } from "react-i18next";
import { Container } from "../../global-styles/containers";

import { SplashBox, Paragraphs } from "./splash.styles";
import { mobileThreshold } from "../../configuration/theme";

import Assets from "../../configuration/assets";

const SplashPage = () => {
  const { t } = useTranslation();
  const { updateHeader } = React.useContext(HeaderContext);

  const isMobile = () => window.innerWidth < mobileThreshold;

  React.useEffect(() => {
    updateHeader({
      title: "MainHeaderTitle",
      signIn: true,
    });
  }, []); // eslint-disable-line

  return (
    <Container tabs={true}>
      <Carousel interval={null}>
        <Carousel.Item>
          <SplashBox className={"SplashBox"} mobile={isMobile()}>
            <div>
              <img
                className="img1 image"
                src={isMobile() ? Assets.cart_mobile : Assets.cart}
                alt={t("SplashPage.Slide1.alt")}
              />
            </div>
            <div>
              <Carousel.Caption>
                <h3>{t("SplashPage.Slide1.header")}</h3>
                <br></br>
                <Paragraphs mobile={isMobile()}>
                  <p>{t("SplashPage.Slide1.text1")}</p>
                </Paragraphs>
                <br></br>
              </Carousel.Caption>
            </div>
          </SplashBox>
        </Carousel.Item>
        <Carousel.Item>
          <SplashBox className={"SplashBox"} mobile={isMobile()}>
            <div>
              <img
                className="img2 image"
                src={isMobile() ? Assets.bill_mobile : Assets.bill}
                alt={t("SplashPage.Slide2.alt")}
              />
            </div>
            <div>
              <Carousel.Caption>
                <h3>{t("SplashPage.Slide2.header")}</h3>
                <br></br>
                <Paragraphs mobile={isMobile()}>
                  <p>{t("SplashPage.Slide2.text1")}</p>
                </Paragraphs>
                <br></br>
              </Carousel.Caption>
            </div>
          </SplashBox>
        </Carousel.Item>
      </Carousel>
    </Container>
  );
};

export default SplashPage;
