import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { FilterTag } from "../../../configuration/backend";
import Routes from "../../../configuration/routes";
import UseLongPress from "../../../util/longpress";
import {
  InlineListItemBox,
  InlineListItemTitle,
} from "../inline-list.item.styles";

export const testIDs = {
  ListItemDeleteButton: "ListItemDeleteButton",
  ListItemElement: "ListItemElement",
  ListItemNewItemInputElement: "ListItemNewItemInputElement",
  ListItemSaveButton: "ListItemSaveButton",
  ListItemTitle: "ListItemTitle",
};

const InlineListItem = ({
  item,
  handleDelete,
  history,
  objectClass,
  transaction,
  redirectTag,
  selected,
  setCreated,
  setSelected,
}) => {
  const { t } = useTranslation();
  const [deleteVisible, setDeleteVisible] = React.useState(false);

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
    setCreated(null);
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

  return (
    <InlineListItemBox
      data-testid={testIDs.ListItemElement}
      {...clickHandler}
      item={item}
    >
      <InlineListItemTitle
        className="inline-list-item-title-div"
        data-testid={testIDs.ListItemTitle}
        onClick={(e) => handleNavigateToItem(e)}
      >
        {item.name}
      </InlineListItemTitle>
      <div>
        {deleteVisible ? (
          <button
            data-testid={testIDs.ListItemDeleteButton}
            onClick={() => handleDelete(item.id, item.name)}
            className="btn btn-danger"
            style={{ height: "40px" }}
          >
            {t("InlineList.DeleteButton")}
          </button>
        ) : null}
      </div>
    </InlineListItemBox>
  );
};

export default InlineListItem;

InlineListItem.propTypes = {
  item: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  objectClass: PropTypes.string.isRequired,
  transaction: PropTypes.bool.isRequired,
  redirectTag: PropTypes.string.isRequired,
  selected: PropTypes.number,
  setCreated: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired,
};
