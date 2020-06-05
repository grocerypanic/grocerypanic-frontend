import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import Header from "../header/header.component";
import MenuItem from "../menu-item/menu-item.component";
import Help from "../simple-list-help/simple-list-help.component";

import { Paper, Container } from "../../global-styles/containers";
import { ListBox, Banner } from "./menu.styles";

const Menu = ({ options, headerTitle, title, history, helpText }) => {
  const choose = (route) => {
    history.push(route);
  };

  return (
    <>
      <Header title={headerTitle} transaction={false} create={null} />
      <Container>
        <Paper>
          <Banner className="alert alert-success">{title}</Banner>
          <ListBox>
            {options.map((item, index) => {
              return (
                <MenuItem
                  name={item.name}
                  location={item.location}
                  key={index}
                  choose={choose}
                />
              );
            })}
          </ListBox>
        </Paper>
      </Container>
      <Help>{helpText}</Help>
    </>
  );
};

export default withRouter(Menu);

Menu.propTypes = {
  headerTitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
    })
  ).isRequired,
  helpText: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
