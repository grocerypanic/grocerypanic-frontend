import PropTypes from "prop-types";
import React from "react";
import Form from "react-bootstrap/Form";

const FormInput = ({
  setErrorMsg,
  state,
  handleState,
  item,
  label,
  fieldName,
  type,
  transaction,
  details,
  size = 20,
  labelColumn = "col-2",
  itemColumn = "col-9",
  ...otherProps
}) => {
  const processChange = (e) => {
    setErrorMsg(null);
    handleState(e.target.value);
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
          id={fieldName}
          type={type}
          name={fieldName}
          size={size}
          value={state}
          onChange={(e) => processChange(e)}
          readOnly={transaction}
          data-testid={`input_${fieldName}`}
          placeholder={""}
          {...otherProps}
        />
      </div>
    </>
  );
};

export default FormInput;

FormInput.propTypes = {
  setErrorMsg: PropTypes.func.isRequired,
  state: PropTypes.any.isRequired,
  handleState: PropTypes.func.isRequired,
  transaction: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  fieldName: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string,
  details: PropTypes.string,
  size: PropTypes.number,
};
