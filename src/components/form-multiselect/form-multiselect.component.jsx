import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { Form } from "react-bootstrap";

const MultiDropDown = ({
  setErrorMsg,
  storeState,
  handleState,
  options,
  label,
  fieldName,
  transaction,
  details,
  size = 20,
  handleChange,
  multi = true,
  labelColumn = "col-2",
  itemColumn = "col-9",
  ...otherProps
}) => {
  const calculateSelections = (value, { action, removedValue }) => {
    setErrorMsg(null);
    switch (action) {
      case "clear":
        handleState([]);
        break;
      case "remove-value":
        handleState(storeState.filter((o) => o.name !== removedValue.label));
        break;
      case "select-option":
        handleState(
          value.map((o) => {
            return { id: o.value, name: o.label };
          })
        );
        break;
      default:
        break;
    }
  };

  const transformed_options = options.map((o) => {
    return { value: o.id, label: o.name };
  });
  const transformed_values = storeState.map((o) => {
    return { value: o.id, label: o.name };
  });

  return (
    <>
      <div className={`${labelColumn} col-form-label`}>
        {label ? (
          <Form.Label htmlFor={`${fieldName}`}>{label}</Form.Label>
        ) : null}
      </div>
      {details ? (
        <div className="col-12">
          <Form.Text className="text-muted">{details}</Form.Text>
        </div>
      ) : null}
      <div className={itemColumn} data-testid={`input_${fieldName}_parent`}>
        <Select
          classNamePrefix="list"
          options={transformed_options}
          isMulti={multi}
          value={transformed_values}
          onChange={calculateSelections}
          isLoading={transaction}
          isRequired
          {...otherProps}
        />
      </div>
    </>
  );
};

export default MultiDropDown;

MultiDropDown.propTypes = {
  setErrorMsg: PropTypes.func.isRequired,
  transaction: PropTypes.bool.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  fieldName: PropTypes.string.isRequired,
  label: PropTypes.string,
  details: PropTypes.string,
  size: PropTypes.number,
};
