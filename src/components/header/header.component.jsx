import React from "react";
import { useTranslation } from "react-i18next";

import AddIcon from "@material-ui/icons/Add";
import HomeIcon from "@material-ui/icons/Home";
import InfoIcon from "@material-ui/icons/Info";
import StoreIcon from "@material-ui/icons/Store";
import KitchenIcon from "@material-ui/icons/Kitchen";
import FormatListNumbered from "@material-ui/icons/FormatListNumbered";

import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { Navbar, Nav, Spinner } from "react-bootstrap";
import {
  NavContainer,
  IconContainer,
  OffIconContainer,
  MenuContainer,
} from "./header.styles";

import Routes from "../../configuration/routes";
import Strings from "../../configuration/strings";
import { headerMobileThreshold } from "../../configuration/theme";

const Header = ({ history, title, create, transaction }) => {
  React.useEffect(() => {}, []);
  const { t } = useTranslation();

  const [mobile, setMobile] = React.useState(
    window.innerWidth < headerMobileThreshold
  );
  const isMobile = () => setMobile(window.innerWidth < headerMobileThreshold);
  const display = (condition) =>
    condition ? "header-visible" : "header-hidden";

  React.useEffect(() => {
    window.addEventListener("resize", isMobile);
    return () => window.removeEventListener("resize", isMobile);
  }, []);

  const navigate = (route) => {
    if (transaction) return;
    history.push(route);
  };

  return (
    <NavContainer collapseOnSelect variant="dark" fixed="top">
      <Navbar.Brand>
        <div className="action" onClick={() => navigate(Routes.about)}>
          <div className={display(mobile)}>{t(Strings.MainTitle)}</div>
          <div className={display(!mobile)}>{`${t(
            Strings.MainTitle
          )}: ${title}`}</div>
        </div>
      </Navbar.Brand>
      <Nav className="mr-auto"></Nav>
      <Nav>
        <Nav.Item
          className="nav-link action fit"
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
          className="nav-link action fit"
          onClick={() => navigate(Routes.root)}
        >
          <MenuContainer
            route={Routes.root}
            history={history}
            data-testid="home-icon"
          >
            <HomeIcon />
          </MenuContainer>
        </Nav.Item>
      </Nav>
      <Nav>
        <Nav.Item
          className="nav-link action fit"
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
          className="nav-link action fit"
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
          className="nav-link action fit"
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
        {create ? (
          <Nav.Item className="nav-link action fit" onClick={create}>
            <IconContainer data-testid="AddIcon">
              {transaction ? (
                <Spinner size="sm" animation="border" />
              ) : (
                <AddIcon />
              )}
            </IconContainer>
          </Nav.Item>
        ) : (
          <Nav.Item className="nav-link fit">
            {transaction ? (
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
  create: PropTypes.func,
  transaction: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
