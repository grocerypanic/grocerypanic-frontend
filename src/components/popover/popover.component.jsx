import React from "react";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import PropTypes from "prop-types";

const GeneratePopOver = ({ translate, children, title, message }) => (
  <OverlayTrigger
    trigger={["hover", "focus"]}
    placement="auto"
    overlay={
      <Popover id="popover-basic">
        <Popover.Title as="h3">{translate(title)}</Popover.Title>
        <Popover.Content>{translate(message)}</Popover.Content>
      </Popover>
    }
  >
    <div>{children}</div>
  </OverlayTrigger>
);

export default GeneratePopOver;

GeneratePopOver.propTypes = {
  translate: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};
