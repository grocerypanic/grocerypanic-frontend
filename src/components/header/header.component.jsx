import AddIcon from "@material-ui/icons/Add";
import FormatListNumbered from "@material-ui/icons/FormatListNumbered";
import HomeIcon from "@material-ui/icons/Home";
import InfoIcon from "@material-ui/icons/Info";
import KitchenIcon from "@material-ui/icons/Kitchen";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import StoreIcon from "@material-ui/icons/Store";
import PropTypes from "prop-types";
import React from "react";
import { Navbar, Nav, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import {
  NavContainer,
  IconContainer,
  OffIconContainer,
  MenuContainer,
} from "./header.styles";
import Routes from "../../configuration/routes";
import { headerMobileThreshold } from "../../configuration/theme";
import { HeaderContext } from "../../providers/header/header.provider";

const Header = ({ history }) => {
  React.useEffect(() => {}, []);
  const { t } = useTranslation();
  const { headerSettings } = React.useContext(HeaderContext);

  const [mobile, setMobile] = React.useState(
    window.innerWidth < headerMobileThreshold
  );
  const isMobile = () => setMobile(window.innerWidth < headerMobileThreshold);
  const display = (condition) =>
    condition ? "header-visible" : "header-hidden";
  const mobileSpacing = (condition) => (condition ? " fit" : "");

  React.useEffect(() => {
    window.addEventListener("resize", isMobile);
    return () => window.removeEventListener("resize", isMobile);
  }, []);

  const navigate = (route) => {
    if (headerSettings.transaction) return;
    if (route === history.location.pathname && history.location.search === "")
      return;
    history.push(route);
  };

  if (headerSettings.disableNav)
    return (
      <NavContainer collapseOnSelect variant="dark" fixed="top">
        <Navbar.Brand>
          <div className="action">
            <div className={display(mobile)}>{t("MainTitle")}</div>
            <div className={display(!mobile)}>{`${t("MainTitle")}: ${t(
              headerSettings.title
            )}`}</div>
          </div>
        </Navbar.Brand>
        <Nav className="ms-auto"></Nav>
      </NavContainer>
    );

  if (headerSettings.signIn)
    return (
      <NavContainer collapseOnSelect variant="dark" fixed="top">
        <Navbar.Brand>
          <div className="action">
            <div className={display(mobile)}>{t("MainTitle")}</div>
            <div className={display(!mobile)}>{`${t("MainTitle")}: ${t(
              headerSettings.title
            )}`}</div>
          </div>
        </Navbar.Brand>
        <Nav className="ms-auto"></Nav>
        <Nav>
          <Nav.Item
            className={"nav-link action" + mobileSpacing(mobile)}
            onClick={() => navigate(Routes.signin)}
          >
            <MenuContainer
              route={Routes.splash}
              history={history}
              data-testid="signIn"
            >
              {t("SplashPage.SignIn")} &nbsp; <LockOpenIcon />
            </MenuContainer>
          </Nav.Item>
        </Nav>
      </NavContainer>
    );

  return (
    <NavContainer collapseOnSelect variant="dark" fixed="top">
      <Navbar.Brand>
        <div className="action" onClick={() => navigate(Routes.about)}>
          <div className={display(mobile)}>{t("MainTitle")}</div>
          <div className={display(!mobile)}>{`${t("MainTitle")}: ${
            headerSettings.title
          }`}</div>
        </div>
      </Navbar.Brand>
      <Nav className="ms-auto"></Nav>
      <Nav>
        <Nav.Item
          className={"nav-link action" + mobileSpacing(mobile)}
          onClick={() => navigate(Routes.about)}
        >
          <MenuContainer
            route={Routes.about}
            history={history}
            data-testid="info-icon"
          >
            <InfoIcon />
          </MenuContainer>
        </Nav.Item>
      </Nav>
      <Nav>
        <Nav.Item
          className={"nav-link action" + mobileSpacing(mobile)}
          onClick={() => navigate(Routes.menu)}
        >
          <MenuContainer
            route={Routes.menu}
            history={history}
            data-testid="home-icon"
          >
            <HomeIcon />
          </MenuContainer>
        </Nav.Item>
      </Nav>
      <Nav>
        <Nav.Item
          className={"nav-link action" + mobileSpacing(mobile)}
          onClick={() => navigate(Routes.stores)}
        >
          <MenuContainer
            route={Routes.stores}
            history={history}
            data-testid="stores-icon"
          >
            <StoreIcon />
          </MenuContainer>
        </Nav.Item>
      </Nav>
      <Nav>
        <Nav.Item
          className={"nav-link action" + mobileSpacing(mobile)}
          onClick={() => navigate(Routes.shelves)}
        >
          <MenuContainer
            route={Routes.shelves}
            history={history}
            data-testid="shelves-icon"
          >
            <KitchenIcon />
          </MenuContainer>
        </Nav.Item>
      </Nav>
      <Nav>
        <Nav.Item
          className={"nav-link action" + mobileSpacing(mobile)}
          onClick={() => navigate(Routes.items)}
        >
          <MenuContainer
            route={Routes.items}
            history={history}
            data-testid="list-icon"
          >
            <FormatListNumbered />
          </MenuContainer>
        </Nav.Item>
      </Nav>
      <Nav>
        {headerSettings.create ? (
          <Nav.Item
            className={"nav-link action" + mobileSpacing(mobile)}
            onClick={headerSettings.create}
          >
            <IconContainer data-testid="AddIcon">
              {headerSettings.transaction ? (
                <Spinner
                  data-testid="AddSpinner"
                  size="sm"
                  animation="border"
                />
              ) : (
                <AddIcon />
              )}
            </IconContainer>
          </Nav.Item>
        ) : (
          <Nav.Item className={"nav-link action" + mobileSpacing(mobile)}>
            {headerSettings.transaction ? (
              <IconContainer>
                <Spinner size="sm" animation="border" />
              </IconContainer>
            ) : (
              <OffIconContainer data-testid="noAddIcon">
                <AddIcon />
              </OffIconContainer>
            )}
          </Nav.Item>
        )}
      </Nav>
    </NavContainer>
  );
};

export default withRouter(Header);

Header.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string.isRequired,
    }),
  }).isRequired,
};
