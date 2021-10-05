import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
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

const InlineListItemForm = ({
  item,
  handleSave,
  setErrorMsg,
  setSelected,
  transaction,
}) => {
  const { t } = useTranslation();
  const fieldItem = React.createRef();

  const handleClick = () => {
    if (transaction) return;
    setSelected(item.id);
  };

  const handleSubmit = (value) => {
    if (transaction) return;
    handleSave(value);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <InlineListItemBox
        data-testid={testIDs.ListItemElement}
        onClick={handleClick}
        item={item}
      >
        <InlineListItemTitle>
          <input
            data-testid={testIDs.ListItemNewItemInputElement}
            autoFocus
            id="newItem"
            type="text"
            ref={fieldItem}
            name="newItem"
            size={15}
            defaultValue={item.name}
            onChange={() => setErrorMsg(null)}
            readOnly={transaction}
          />
        </InlineListItemTitle>
        <div>
          <button
            data-testid={testIDs.ListItemSaveButton}
            onClick={() => handleSubmit(fieldItem.current.value)}
            className="btn btn-success"
            style={{ height: "40px" }}
          >
            <span>{t("InlineList.SaveButton")}</span>
          </button>
        </div>
      </InlineListItemBox>
    </form>
  );
};

export default InlineListItemForm;

InlineListItemForm.propTypes = {
  item: PropTypes.object.isRequired,
  handleSave: PropTypes.func.isRequired,
  setErrorMsg: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired,
  transaction: PropTypes.bool.isRequired,
};
