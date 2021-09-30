import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { ListItem, ListTitle } from "./simple-list-item.styles";
import { FilterTag } from "../../../configuration/backend";
import Routes from "../../../configuration/routes";
import UseLongPress from "../../../util/longpress";

export const testIDs = {
  ListItemDeleteButton: "ListItemDeleteButton",
  ListItemElement: "ListItemElement",
  ListItemNewItemInputElement: "ListItemNewItemInputElement",
  ListItemSaveButton: "ListItemSaveButton",
  ListItemTitle: "ListItemTitle",
};

const SimpleListItem = ({
  item,
  handleDelete,
  handleSave,
  history,
  setErrorMsg,
  objectClass,
  transaction,
  redirectTag,
  selected,
  setSelected,
}) => {
  const { t } = useTranslation();
  const fieldItem = React.createRef();
  const [deleteVisible, setDeleteVisible] = React.useState(false);
  const newItemID = -1;

  React.useEffect(() => {
    if (selected === item.id || selected === null) return;
    setDeleteVisible(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const handleLongClick = (e) => {
    if (transaction) return;
    setDeleteVisible(true);
  };

  const handleShortClick = (e) => {
    if (transaction) return;
    setSelected(item.id);
  };

  const clickHandler = UseLongPress(
    (e) => handleLongClick(e),
    (e) => handleShortClick(e),
    500
  );

  const handleNavigateToItem = (e) => {
    if (transaction) return;
    const params = {};
    params[FilterTag] = item.name;
    params[redirectTag] = item.id;
    params.class = objectClass;
    history.push(`${Routes.items}?${new URLSearchParams(params).toString()}`);
  };

  if (item.id === newItemID) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <ListItem
          data-testid={testIDs.ListItemElement}
          {...clickHandler}
          item={item}
        >
          <ListTitle>
            <input
              data-testid={testIDs.ListItemNewItemInputElement}
              autoFocus
              id="newItem"
              type="text"
              ref={fieldItem}
              name="newItem"
              size={15}
              required
              defaultValue={item.name}
              onChange={() => setErrorMsg(null)}
              readOnly={transaction}
            />
          </ListTitle>
          {!transaction ? (
            <div>
              <button
                data-testid={testIDs.ListItemSaveButton}
                onClick={() => handleSave(fieldItem.current.value)}
                className="btn btn-success"
                style={{ height: "40px" }}
              >
                <span>{t("SimpleList.SaveButton")}</span>
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
      data-testid={testIDs.ListItemElement}
      {...clickHandler}
      item={item}
    >
      <ListTitle
        className="simple-list-item-title-div"
        data-testid={testIDs.ListItemTitle}
        onClick={(e) => handleNavigateToItem(e)}
      >
        {item.name}
      </ListTitle>
      <div>
        {deleteVisible ? (
          <button
            data-testid={testIDs.ListItemDeleteButton}
            onClick={() => handleDelete(item.id, item.name)}
            className="btn btn-danger"
            style={{ height: "40px" }}
          >
            {t("SimpleList.DeleteButton")}
          </button>
        ) : null}
      </div>
    </ListItem>
  );
};

export default SimpleListItem;

SimpleListItem.propTypes = {
  item: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  setErrorMsg: PropTypes.func.isRequired,
  objectClass: PropTypes.string.isRequired,
  transaction: PropTypes.bool.isRequired,
  redirectTag: PropTypes.string.isRequired,
  selected: PropTypes.number,
  setSelected: PropTypes.func.isRequired,
};
