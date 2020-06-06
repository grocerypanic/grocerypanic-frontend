import React from "react";

import StopIcon from "@material-ui/icons/Stop";
import AddIcon from "@material-ui/icons/Add";
import HomeIcon from "@material-ui/icons/Home";
import StoreIcon from "@material-ui/icons/Store";
import KitchenIcon from "@material-ui/icons/Kitchen";

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

const Header = ({ history, title, create, transaction }) => {
  React.useEffect(() => {}, []);

  const navigate = (route) => {
    if (transaction) return;
    history.push(route);
  };

  return (
    <NavContainer collapseOnSelect variant="dark" fixed="top">
      <Navbar.Brand href="#home">Panic: {title}</Navbar.Brand>
      <Nav className="mr-auto"></Nav>
      <Nav>
        <Nav.Item className="nav-link" onClick={() => navigate(Routes.root)}>
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
        <Nav.Item className="nav-link" onClick={() => navigate(Routes.stores)}>
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
        <Nav.Item className="nav-link" onClick={() => navigate(Routes.shelves)}>
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
        {create ? (
          <Nav.Item className="nav-link" onClick={create}>
            <IconContainer>
              {transaction ? (
                <Spinner size="sm" animation="border" />
              ) : (
                <AddIcon className="AddIcon" />
              )}
            </IconContainer>
          </Nav.Item>
        ) : (
          <Nav.Item className="nav-link">
            <OffIconContainer>
              <StopIcon />
            </OffIconContainer>
          </Nav.Item>
        )}
      </Nav>
    </NavContainer>
  );
};

export default withRouter(Header);

Header.propTypes = {
  create: PropTypes.func,
  title: PropTypes.string.isRequired,
  transaction: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
