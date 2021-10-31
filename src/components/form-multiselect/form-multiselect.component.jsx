import PropTypes from "prop-types";
import React from "react";
import Form from "react-bootstrap/Form";
import Select from "react-select";

const MultiDropDown = ({
  details,
  fieldName,
  handleState,
  label,
  options,
  setErrorMsg,
  state,
  transaction,
  itemColumn = "col-9",
  labelColumn = "col-2",
  multi = true,
  size = 20,
  ...otherProps
}) => {
  const calculateSelections = (value, { action, removedValue }) => {
    setErrorMsg(null);
    switch (action) {
      case "clear":
        handleState([]);
        break;
      case "remove-value":
        handleState(state.filter((o) => o.name !== removedValue.label));
        break;
      case "select-option":
        handleState(
          value.map((o) => {
            return { id: o.value, name: o.label };
          })
        );
        break;
      /* istanbul ignore next */
      default:
        break;
    }
  };

  const transformed_options = options.map((o) => {
    return { value: o.id, label: o.name };
  });
  const transformed_values = state.map((o) => {
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
  details: PropTypes.string,
  fieldName: PropTypes.string.isRequired,
  handleState: PropTypes.func.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  setErrorMsg: PropTypes.func.isRequired,
  state: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.number.isRequired, name: PropTypes.string })
  ).isRequired,
  transaction: PropTypes.bool.isRequired,
  itemColumn: PropTypes.string,
  labelColumn: PropTypes.string,
  multi: PropTypes.bool,
  size: PropTypes.number,
};
