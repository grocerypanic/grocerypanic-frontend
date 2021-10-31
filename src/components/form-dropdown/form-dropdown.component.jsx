import PropTypes from "prop-types";
import React from "react";
import Form from "react-bootstrap/Form";

const DropDown = ({
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
  size = 20,
  ...otherProps
}) => {
  const calculateSelections = (e) => {
    setErrorMsg(null);
    const targetValue = e.target.value !== "" ? e.target.value : null;
    const selected = options.find((o) => o.name === targetValue);
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
          value={state !== null ? state : ""}
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
  state: PropTypes.string,
  handleState: PropTypes.func.isRequired,
  setErrorMsg: PropTypes.func.isRequired,
  transaction: PropTypes.bool.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  fieldName: PropTypes.string.isRequired,
  label: PropTypes.string,
  details: PropTypes.string,
  size: PropTypes.number,
};
