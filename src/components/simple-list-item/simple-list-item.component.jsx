import React from "react";
import { useTranslation } from "react-i18next";

import { AnalyticsContext } from "../../providers/analytics/analytics.provider";
import { AnalyticsActions } from "../../providers/analytics/analytics.actions";

import Strings from "../../configuration/strings";

import { ListItem } from "./simple-list-item.styles";

const SimpleListItem = ({
  item,
  allItems,
  add,
  del,
  selected,
  setSelected,
  errorMsg,
  setErrorMsg,
  setCreated,
  transaction,
}) => {
  const { t } = useTranslation();
  const fieldItem = React.createRef();
  const { event } = React.useContext(AnalyticsContext);

  const handleClick = (e) => {
    e.preventDefault();
    if (transaction) return;
    if (item.id !== selected) setCreated(false);
    setSelected(item.id);
  };

  const handleChange = (value) => {
    if (errorMsg) {
      setErrorMsg(null);
    }
  };

  const handleSave = (value) => {
    if (value.length < 2) {
      setErrorMsg(t(Strings.SimpleListValidationFailure));
      return;
    }
    const search = allItems.find((instance) => instance.name === value);
    if (search) {
      setErrorMsg(t(Strings.SimpleListValidationAlreadyExists));
      return;
    }
    add(value);
  };

  const handleDelete = (id) => {
    setSelected(null);
    del(item.id);
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
          onClick={handleClick}
          item={item}
        >
          <div>
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
              onFocus={(e) => handleClick(e)}
              onChange={(e) => handleChange(e.currentTarget.value)}
              readOnly={transaction}
            />
          </div>
          {!transaction ? (
            <div>
              <button
                data-testid="saveButton"
                onClick={() => handleSave(fieldItem.current.value)}
              >
                {t(Strings.SimpleListSave)}
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
      onClick={handleClick}
      item={item}
    >
      {item.name}
      <div>
        {selected === item.id && !transaction ? (
          <button
            data-testid="deleteButton"
            onClick={() => handleDelete(item.id)}
          >
            {t(Strings.SimpleListDelete)}
          </button>
        ) : null}
      </div>
    </ListItem>
  );
};

export default SimpleListItem;
