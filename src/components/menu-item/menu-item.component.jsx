import React from "react";
import PropTypes from "prop-types";

import { ListItem, ListTitle } from "./menu-item.styles";

const MenuItem = ({ name, location, choose }) => {
  return (
    <ListItem data-testid="MenuElement" onClick={() => choose(location)}>
      <ListTitle>{name}</ListTitle>
    </ListItem>
  );
};

export default MenuItem;

MenuItem.propTypes = {
  name: PropTypes.string,
  location: PropTypes.string,
  choose: PropTypes.func,
};
