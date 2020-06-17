// For editing existing components, then will add create functionality

import React from "react";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";

import { useTranslation } from "react-i18next";

import Alert from "../alert/alert.component";
import Help from "../simple-list-help/simple-list-help.component";
import FormInput from "../form-input/form-input.component";
import DropDown from "../form-dropdown/form-dropdown.component";
import MultiDropDown from "../form-multiselect/form-multiselect.component";

import { Paper } from "../../global-styles/containers";
import { FormBox, Outline, Banner, ButtonBox } from "./item-details.styles";

import { Constants, ShelfLifeConstants } from "../../configuration/backend";
import Strings from "../../configuration/strings";
import { ui } from "../../configuration/theme";

import {
  normalizeNameArray,
  normalizeName,
  normalizeId,
  normalizeShelfLifeName,
} from "./item-details.utils";

const ItemDetailsForm = ({
  item,
  title,
  helpText,
  transaction,
  stores,
  shelves,
  handleSave,
  handleDelete,
}) => {
  const { t } = useTranslation();

  // Create State For Each Form Component
  const [nameState, setNameState] = React.useState("");
  const [quantityState, setQuantityState] = React.useState("");
  const [priceState, setPriceState] = React.useState("");
  const [shelfLifeState, setShelfLifeState] = React.useState("");
  const [preferredStoresState, setPreferredStoresState] = React.useState([]);
  const [shelfState, setShelfState] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [shelfOptions, setShelfOptions] = React.useState([]);
  const [actionMsg, setActionMsg] = React.useState(null);

  // Normalize the api data as it comes in
  React.useEffect(() => {
    setNameState(item.name);
    setQuantityState(item.quantity);
    setPriceState(item.price);
    setShelfLifeState(normalizeShelfLifeName(item.shelf_life));
    setPreferredStoresState(normalizeNameArray(item.preferred_stores, stores));
    setShelfState(normalizeName(item.shelf, shelves));
  }, [item, stores, shelves]);

  // The data from the api may include a non standard shelf-life option
  // Normalize the shelf options and create a new custom entry if needed
  React.useEffect(() => {
    const options = [...ShelfLifeConstants];
    const search = options.findIndex((o) => o.id === item.shelf_life);
    if (search >= 0) {
      setShelfOptions(options);
    } else {
      setShelfOptions([
        ...options,
        { name: `${item.shelf_life} Days`, id: item.shelf_life },
      ]);
    }
  }, [shelves]);

  // Reassemble the form data into an object and pass back to handleSave
  // Perform validation as needed
  const handleSubmit = () => {
    if (transaction) return;
    const derivedShelfLife = normalizeId(shelfLifeState, ShelfLifeConstants);
    if (preferredStoresState.length === 0) {
      setErrorMsg(t(Strings.ItemDetails.ErrorUnselectedStore));
      return setTimeout(() => setErrorMsg(null), ui.alertTimeout);
    }
    const newItem = {
      id: item.id,
      name: nameState,
      quantity: quantityState,
      price: priceState,
      shelf_life: derivedShelfLife ? derivedShelfLife : item.shelf_life,
      preferred_stores: preferredStoresState.map((o) => o.id),
      shelf: normalizeId(shelfState, shelves),
    };
    handleSave(newItem);
    setActionMsg(t(Strings.ItemDetails.SaveAction));
    return setTimeout(() => setActionMsg(null), ui.alertTimeout);
  };

  const handleDeleteButton = (e) => {
    if (transaction) return;
    handleDelete(item);
    setActionMsg(t(Strings.ItemDetails.DeleteAction));
  };

  return (
    <>
      <Paper>
        {errorMsg ? (
          <Banner className="alert alert-danger">{errorMsg}</Banner>
        ) : (
          <Banner className="alert alert-success">{title}</Banner>
        )}
        <Outline>
          <FormBox>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <Form.Group className="row">
                <FormInput
                  setErrorMsg={setErrorMsg}
                  storeState={nameState}
                  handleState={setNameState}
                  fieldName="name"
                  item={item}
                  transaction={transaction}
                  type="text"
                  label={`${t(Strings.ItemDetails.NameLabel)}:`}
                  details={""}
                  itemColumn={"col-10"}
                  minLength={2}
                  maxLength={24}
                />
              </Form.Group>
              <Form.Group className="row">
                <FormInput
                  setErrorMsg={setErrorMsg}
                  storeState={quantityState}
                  handleState={setQuantityState}
                  fieldName="quantity"
                  item={item}
                  transaction={transaction}
                  type="number"
                  label={`${t(Strings.ItemDetails.QuantityLabel)}:`}
                  details={""}
                  itemColumn={"col-10"}
                  min={Constants.minimumQuanity}
                  max={Constants.maximumQuantity}
                  step="1"
                  readOnly={true}
                />
                <FormInput
                  setErrorMsg={setErrorMsg}
                  storeState={priceState}
                  handleState={setPriceState}
                  fieldName="price"
                  item={item}
                  transaction={transaction}
                  type="number"
                  label={`${t(Strings.ItemDetails.PriceLabel)}:`}
                  details={""}
                  itemColumn={"col-10"}
                  min={Constants.minimumPrice}
                  max={Constants.maximumPrice}
                  step="0.01"
                />
              </Form.Group>
              <Form.Group className="row">
                <DropDown
                  setErrorMsg={setErrorMsg}
                  storeState={shelfLifeState}
                  handleState={setShelfLifeState}
                  fieldName="shelf_life"
                  options={shelfOptions}
                  transaction={transaction}
                  details={t(Strings.ItemDetails.ShelfLifeDetail)}
                  labelColumn={""}
                  itemColumn={"col-12"}
                />
              </Form.Group>
              <Form.Group className="row">
                <MultiDropDown
                  setErrorMsg={setErrorMsg}
                  storeState={preferredStoresState}
                  handleState={setPreferredStoresState}
                  fieldName="preferred_stores"
                  options={stores}
                  transaction={transaction}
                  details={t(Strings.ItemDetails.PerferredLocationDetails)}
                  labelColumn={""}
                  itemColumn={"col-12"}
                />
              </Form.Group>
              <Form.Group className="row">
                <DropDown
                  setErrorMsg={setErrorMsg}
                  storeState={shelfState}
                  handleState={setShelfState}
                  fieldName="shelf"
                  options={shelves}
                  transaction={transaction}
                  details={t(Strings.ItemDetails.ShelvesDetail)}
                  labelColumn={""}
                  itemColumn={"col-12"}
                />
              </Form.Group>
              <ButtonBox>
                <button
                  data-testid="delete"
                  type="button"
                  className={`btn ${
                    transaction ? "btn-secondary" : "btn-danger"
                  }`}
                  onClick={handleDeleteButton}
                >
                  {Strings.ItemDetails.DeleteButton}
                </button>
                <button
                  data-testid="submit"
                  type="submit"
                  className={`btn ${
                    transaction ? "btn-secondary" : "btn-success"
                  }`}
                >
                  {Strings.ItemDetails.SaveButton}
                </button>
              </ButtonBox>
            </Form>
          </FormBox>
        </Outline>
      </Paper>
      <Alert message={actionMsg} />
      <Help>{helpText}</Help>
    </>
  );
};

export default ItemDetailsForm;

ItemDetailsForm.propTypes = {
  item: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  helpText: PropTypes.string.isRequired,
  transaction: PropTypes.bool.isRequired,
  stores: PropTypes.arrayOf(PropTypes.object).isRequired,
  shelves: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleSave: PropTypes.func.isRequired,
  handleDelete: PropTypes.func,
};
