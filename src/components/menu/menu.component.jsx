import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import MenuItem from "../menu-item/menu-item.component";
import Hint from "../hint/hint.component";

import { HeaderContext } from "../../providers/header/header.provider";

import { Paper, Container } from "../../global-styles/containers";
import { ItemizedBanner } from "../../global-styles/banner";
import { Scroller, ListBox } from "./menu.styles";
import calculateMaxHeight from "../../util/height";

const Menu = ({ options, headerTitle, title, history, helpText }) => {
  const choose = (route) => {
    history.push(route);
  };
  const [listSize, setListSize] = React.useState(calculateMaxHeight());
  const { updateHeader } = React.useContext(HeaderContext);

  const recalculateHeight = () => setListSize(calculateMaxHeight());

  React.useEffect(() => {
    updateHeader({
      title: headerTitle,
      create: null,
      transaction: false,
      disableNav: false,
    });
    window.addEventListener("resize", recalculateHeight);
    return () => {
      window.removeEventListener("resize", recalculateHeight);
    };
  }, []); // eslint-disable-line

  return (
    <>
      <Container>
        <Paper>
          <ItemizedBanner className="alert alert-success">
            {title}
          </ItemizedBanner>
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
      <Hint>{helpText}</Hint>
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
