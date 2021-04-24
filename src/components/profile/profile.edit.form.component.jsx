import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";

import FormInput from "../form-input/form-input.component";
import Alert from "../alert/alert.component";
import Hint from "../hint/hint.component";

import SearchSelect from "../form-search-select/form-search-select.component";

import { Paper, Container } from "../../global-styles/containers";
import { Banner } from "../../global-styles/banner";
import { ui } from "../../configuration/theme";

import { FormBox, Outline, ButtonBox } from "./profile.form.styles";

const ProfileForm = ({
  title,
  timezones,
  transaction,
  user,
  handleSave,
  helpText,
}) => {
  const { t } = useTranslation();

  const [nameFirstState, setNameFirstState] = React.useState(
    user[0].first_name
  );
  const [nameLastState, setNameLastState] = React.useState(user[0].last_name);
  const [tzState, setTZState] = React.useState(
    timezones.find((o) => (o.name = user[0].timezone))
  );
  const [actionMsg, setActionMsg] = React.useState(null);

  const handleSubmit = () => {
    if (transaction) return;
    const new_user = {
      ...user[0],
      timezone: tzState.name,
      first_name: nameFirstState,
      last_name: nameLastState,
      has_profile_initialized: true,
    };
    handleSave(new_user);
    setActionMsg(t("Profile.SaveAction"));
    return setTimeout(() => setActionMsg(null), ui.alertTimeout);
  };

  return (
    <Container>
      <Paper>
        <Banner className="alert alert-success">{title}</Banner>
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
                  setErrorMsg={nullFunction}
                  storeState={nameFirstState}
                  handleState={setNameFirstState}
                  fieldName="first_name"
                  item={user[0]}
                  transaction={transaction}
                  type="text"
                  label={""}
                  details={t("Profile.FirstNameDetails")}
                  itemColumn={"col-12"}
                  minLength={2}
                  maxLength={150}
                />
              </Form.Group>
              <Form.Group className="row">
                <FormInput
                  setErrorMsg={nullFunction}
                  storeState={nameLastState}
                  handleState={setNameLastState}
                  fieldName="last_name"
                  item={user[0]}
                  transaction={transaction}
                  type="text"
                  label={""}
                  details={t("Profile.LastNameDetails")}
                  itemColumn={"col-12"}
                  minLength={2}
                  maxLength={150}
                />
              </Form.Group>
              <Form.Group className="row">
                <SearchSelect
                  setErrorMsg={nullFunction}
                  storeState={tzState}
                  handleState={setTZState}
                  fieldName="timezone"
                  options={timezones}
                  transaction={transaction}
                  details={t("Profile.LocationDetails")}
                  itemColumn={"col-12"}
                />
              </Form.Group>
              <ButtonBox>
                <button
                  data-testid="submit"
                  type="submit"
                  className={`btn ${
                    transaction ? "btn-secondary" : "btn-success"
                  }`}
                >
                  {t("Profile.SaveButton")}
                </button>
              </ButtonBox>
            </Form>
          </FormBox>
        </Outline>
      </Paper>
      <Alert message={actionMsg} />
      <Hint>{helpText}</Hint>
    </Container>
  );
};

export default ProfileForm;
export const nullFunction = () => {};

ProfileForm.propTypes = {
  user: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  helpText: PropTypes.string.isRequired,
  transaction: PropTypes.bool.isRequired,
  timezones: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleSave: PropTypes.func.isRequired,
};
