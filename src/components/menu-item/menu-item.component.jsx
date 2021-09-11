import PropTypes from "prop-types";
import React from "react";
import { ListItem, ListTitle } from "./menu-item.styles";

const MenuItem = ({ name, location, choose }) => {
  return (
    <ListItem>
      <ListTitle data-testid={"MenuElement"} onClick={() => choose(location)}>
        {name}
      </ListTitle>
    </ListItem>
  );
};

export default MenuItem;

MenuItem.propTypes = {
  name: PropTypes.string,
  location: PropTypes.string,
  choose: PropTypes.func,
};
