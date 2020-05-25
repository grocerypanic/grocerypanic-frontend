import React from "react";
import { useTranslation } from "react-i18next";
import AddIcon from "@material-ui/icons/Add";

import UserReducer from "../../providers/user/user.reducer";

import { Navbar, Nav, Spinner } from "react-bootstrap";
import { NavContainer } from "./header.styles";

import Strings from "../../configuration/strings";

const Header = ({ title, create, transaction }) => {
  const [user, dispatch] = React.useReducer(UserReducer);

  React.useEffect(() => {}, []);

  return (
    <NavContainer collapseOnSelect expand="lg" variant="dark">
      <Navbar.Brand href="#home">{title}</Navbar.Brand>
      <Nav className="mr-auto"></Nav>
      <Nav>
        <Nav.Item className="nav-link" onClick={create}>
          {transaction ? <Spinner size="sm" animation="border" /> : <AddIcon />}
        </Nav.Item>
      </Nav>
    </NavContainer>
  );
};

export default Header;
