import PropTypes from "prop-types";
import React from "react";
import Form from "react-bootstrap/Form";

const DropDown = ({
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
  labelColumn = "col-2",
  itemColumn = "col-9",
  ...otherProps
}) => {
  const calculateSelections = (e) => {
    setErrorMsg(null);
    const selected = options.find((o) => o.name === e.target.value);
    handleState(selected.name);
  };

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
      <div className={itemColumn}>
        <Form.Control
          as="select"
          id={fieldName}
          name={fieldName}
          size={size}
          value={storeState}
          onChange={(e) => calculateSelections(e)}
          readOnly={transaction}
          data-testid={`input_${fieldName}`}
          {...otherProps}
        >
          {options.map((item) => {
            return <option key={item.id}>{item.name}</option>;
          })}
        </Form.Control>
      </div>
    </>
  );
};

export default DropDown;

DropDown.propTypes = {
  setErrorMsg: PropTypes.func.isRequired,
  transaction: PropTypes.bool.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  fieldName: PropTypes.string.isRequired,
  label: PropTypes.string,
  details: PropTypes.string,
  size: PropTypes.number,
};
