import React from "react";
import { useTranslation } from "react-i18next";
import AddIcon from "@material-ui/icons/Add";

import { UserContext } from "../../providers/user/user.provider";

import { Navbar, Nav, Spinner } from "react-bootstrap";
import { NavContainer } from "./header.styles";

const Header = ({ title, create, transaction }) => {
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
