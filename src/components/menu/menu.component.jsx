import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import Header from "../header/header.component";
import MenuItem from "../menu-item/menu-item.component";
import Help from "../simple-list-help/simple-list-help.component";

import { Paper, Container } from "../../global-styles/containers";
import { Scroller, ListBox, Banner } from "./menu.styles";
import calculateMaxHeight from "../../util/height";

const Menu = ({ options, headerTitle, title, history, helpText }) => {
  const choose = (route) => {
    history.push(route);
  };
  const [listSize, setListSize] = React.useState(calculateMaxHeight());

  const recalculateHeight = () => setListSize(calculateMaxHeight());

  React.useEffect(() => {
    window.addEventListener("resize", recalculateHeight);
    return () => {
      window.removeEventListener("resize", recalculateHeight);
    };
  }, []);

  return (
    <>
      <Header title={headerTitle} transaction={false} create={null} />
      <Container>
        <Paper>
          <Banner className="alert alert-success">{title}</Banner>
          <Scroller className="overflow-auto" size={listSize}>
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
          </Scroller>
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
