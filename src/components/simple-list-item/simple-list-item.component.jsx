import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { AnalyticsContext } from "../../providers/analytics/analytics.provider";
import { AnalyticsActions } from "../../providers/analytics/analytics.actions";

import Strings from "../../configuration/strings";
import Routes from "../../configuration/routes";
import { FilterTag } from "../../configuration/backend";
import { ui } from "../../configuration/theme";
import UseLongPress from "../../util/longpress";

import { ListItem, ListTitle } from "./simple-list-item.styles";

const SimpleListItem = ({
  item,
  allItems,
  listFunctions,
  listValues,
  history,
  redirectTag,
}) => {
  const { t } = useTranslation();
  const fieldItem = React.createRef();
  const { event } = React.useContext(AnalyticsContext);

  const {
    add,
    del,
    setSelected,
    setErrorMsg,
    setCreated,
    setLongPress,
    setActionMsg,
  } = listFunctions;

  const { selected, errorMsg, transaction, longPress } = listValues;

  const handleNavigateToItem = (e) => {
    if (transaction) return;
    if (item.id !== selected) return;
    if (longPress) return;
    history.push(
      `${Routes.items}?${FilterTag}=${encodeURIComponent(
        item.name
      )}&${redirectTag}=${item.id}`
    );
  };

  const handleLongClick = (e) => {
    if (transaction) return;
    setLongPress(true);
  };

  const handleShortClick = (e) => {
    if (transaction) return;
    if (item.id !== selected) {
      setCreated(false);
      setLongPress(false);
    }
    setSelected(item.id);
  };

  const handleClick = UseLongPress(handleLongClick, handleShortClick, 500);

  const handleChange = (value) => {
    if (errorMsg) {
      setErrorMsg(null);
    }
  };

  const handleSave = (value) => {
    if (value.length < 2) {
      setErrorMsg(t(Strings.SimpleList.ValidationFailure));
      return;
    }
    const search = allItems.find((instance) => instance.name === value);
    if (search) {
      setErrorMsg(t(Strings.SimpleList.ValidationAlreadyExists));
      return;
    }
    setActionMsg(`${t(Strings.SimpleList.CreatedAction)} ${value}`);
    add(value);
    return setTimeout(() => setActionMsg(null), ui.alertTimeout);
  };

  const handleDelete = (id) => {
    setSelected(null);
    setActionMsg(`${t(Strings.SimpleList.DeletedAction)} ${item.name}`);
    del(item.id);
    return setTimeout(() => setActionMsg(null), ui.alertTimeout);
  };

  if (item.id === -1) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <ListItem
          data-testid="listElement"
          selected={selected}
          {...handleClick}
          item={item}
        >
          <ListTitle>
            <input
              data-testid="inputElement"
              autoFocus
              id="newItem"
              type="newItem"
              ref={fieldItem}
              name="newItem"
              size={15}
              required
              defaultValue={item.name}
              onFocus={(e) => handleShortClick(e)}
              onChange={(e) => handleChange(e.currentTarget.value)}
              readOnly={transaction}
            />
          </ListTitle>
          {!transaction ? (
            <div>
              <button
                data-testid="saveButton"
                onClick={() => handleSave(fieldItem.current.value)}
                className="btn btn-success"
                style={{ height: "40px" }}
              >
                <span>{t(Strings.SimpleList.SaveButton)}</span>
              </button>
            </div>
          ) : (
            <div></div>
          )}
        </ListItem>
      </form>
    );
  }

  return (
    <ListItem
      data-testid="listElement"
      selected={selected}
      {...handleClick}
      item={item}
    >
      <ListTitle
        className="simple-list-item-title-div"
        data-testid="ListTitle"
        onClick={(e) => handleNavigateToItem(e)}
      >
        {item.name}
      </ListTitle>
      <div>
        {selected === item.id && !transaction && longPress ? (
          <button
            data-testid="deleteButton"
            onClick={() => handleDelete(item.id)}
            className="btn btn-danger"
            style={{ height: "40px" }}
          >
            {t(Strings.SimpleList.DeleteButton)}
          </button>
        ) : null}
      </div>
    </ListItem>
  );
};

export default withRouter(SimpleListItem);

SimpleListItem.propTypes = {
  item: PropTypes.object.isRequired,
  allItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  listFunctions: PropTypes.shape({
    add: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    setSelected: PropTypes.func.isRequired,
    setErrorMsg: PropTypes.func.isRequired,
    setCreated: PropTypes.func.isRequired,
    setLongPress: PropTypes.func.isRequired,
    setActionMsg: PropTypes.func.isRequired,
  }).isRequired,
  listValues: PropTypes.shape({
    selected: PropTypes.number,
    errorMsg: PropTypes.string,
    transaction: PropTypes.bool.isRequired,
    longPress: PropTypes.bool.isRequired,
  }).isRequired,
  redirectTag: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
};
