import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import Dropdown from "react-bootstrap/Dropdown";
import DropdownItem from "react-bootstrap/DropdownItem";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownToggle from "react-bootstrap/DropdownToggle";

import ButtonGroup from "react-bootstrap/ButtonGroup";

import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

import Routes from "../../configuration/routes";
import GeneratePopOver from "../popover/popover.component";

import { ui } from "../../configuration/theme";
import { Control, Digit, Symbol, Row, ListTitle } from "./item-list-row.styles";

import { nextWeek, expired } from "../../util/datetime";

const ItemListRow = ({
  item,
  allItems,
  listFunctions,
  listValues,
  history,
}) => {
  const { t } = useTranslation();
  const { restock, consume, setErrorMsg, setActionMsg } = listFunctions;
  const { transaction } = listValues;

  const range = (n) => [...Array(n).keys()];

  const handleClick = (e) => {
    if (transaction) return;
    history.push(Routes.details.replace(":id", item.id));
  };

  const handleRestock = (quantity, e) => {
    if (transaction) return;
    e.preventDefault();
    restock(item, quantity);
    setActionMsg(`${item.name} +${quantity}`);
    return setTimeout(() => setActionMsg(null), ui.alertTimeout);
  };

  const handleConsume = (quantity, e) => {
    if (transaction) return;
    e.preventDefault();
    if (item.quantity < quantity) {
      setErrorMsg(t("InventoryPage.ErrorInsufficientInventory"));
      return setTimeout(() => setErrorMsg(null), ui.alertTimeout);
    }
    consume(item, quantity);
    setActionMsg(`${item.name} -${quantity}`);
    return setTimeout(() => setActionMsg(null), ui.alertTimeout);
  };

  const generateDropDownOptions = (string, count, prefix) => {
    return range(count).map((o, i) => {
      let name = string.slice(0, 10);
      if (name.length < string.length) name += "...";
      return (
        <DropdownItem key={i} eventKey={i + 1}>
          <strong>
            {name} {`${prefix} ${i + 1}`}
          </strong>
        </DropdownItem>
      );
    });
  };

  const getExpiryClass = () => {
    if (item.quantity === 0) return "text-danger";
    if (nextWeek(item.next_expiry_date)) return "text-warning";
    if (expired(item.next_expiry_date)) return "text-danger";
    return "text-success";
  };

  return (
    <Row warning={false} danger={false} data-testid="listElement" item={item}>
      <Digit data-testid="item-quantity" className={getExpiryClass()}>
        <GeneratePopOver
          translate={t}
          title={"InventoryPage.Quantity.Title"}
          message={"InventoryPage.Quantity.Message"}
        >
          <div data-testid="quantity">{item.quantity}</div>
        </GeneratePopOver>
      </Digit>
      <Digit className="text-danger">
        <GeneratePopOver
          translate={t}
          title={"InventoryPage.Expired.Title"}
          message={"InventoryPage.Expired.Message"}
        >
          <div data-testid="expired">{item.expired}</div>
        </GeneratePopOver>
      </Digit>
      <ListTitle>
        <div>
          <span data-testid="listTitle" onClick={handleClick}>
            {item.name}
          </span>
        </div>
      </ListTitle>
      <Control type="restock" data-testid="restock">
        <Dropdown alignRight as={ButtonGroup} onSelect={handleRestock}>
          <DropdownToggle
            id="dropdown-custom-1"
            size="sm"
            variant={transaction ? "secondary" : "success"}
          >
            <Symbol>
              <AddIcon className="svg_icons" />
            </Symbol>
          </DropdownToggle>
          {transaction ? null : (
            <DropdownMenu popperConfig={{ position: "fixed" }}>
              {generateDropDownOptions(item.name, 5, "+")}
            </DropdownMenu>
          )}
        </Dropdown>
      </Control>
      <Control type="consume" data-testid="consume">
        <Dropdown alignRight as={ButtonGroup} onSelect={handleConsume}>
          <DropdownToggle
            id="dropdown-custom-2"
            size="sm"
            variant={transaction ? "secondary" : "danger"}
          >
            <Symbol>
              <RemoveIcon className="svg_icons" />
            </Symbol>
          </DropdownToggle>
          {transaction ? null : (
            <DropdownMenu>
              {generateDropDownOptions(item.name, 5, "-")}
            </DropdownMenu>
          )}
        </Dropdown>
      </Control>
    </Row>
  );
};

export default ItemListRow;

ItemListRow.propTypes = {
  item: PropTypes.object.isRequired,
  allItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  listFunctions: PropTypes.shape({
    restock: PropTypes.func.isRequired,
    consume: PropTypes.func.isRequired,
    setErrorMsg: PropTypes.func.isRequired,
    setActionMsg: PropTypes.func.isRequired,
  }).isRequired,
  listValues: PropTypes.shape({
    transaction: PropTypes.bool.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
