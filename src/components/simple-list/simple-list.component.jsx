import React from "react";

import Header from "../header/header.component";
import SimpleListItem from "../simple-list-item/simple-list-item.component";

import ApiActions from "../../providers/api/api.actions";

import { Paper, Container } from "../../global-styles/containers";
import { ListBox, Banner } from "./simple-list.styles";

const SimpleList = ({ headerTitle, title, ApiObjectContext }) => {
  const { apiObject, dispatch } = React.useContext(ApiObjectContext);
  const [selected, setSelected] = React.useState(null);
  const [created, setCreated] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);

  const handleCreate = () => {
    if (apiObject.transaction) return;
    setCreated({ id: -1, name: "" });
    setSelected(-1);
  };

  const handleSave = () => {
    if (apiObject.transaction) return;
    dispatch({ type: ApiActions.StartAdd, func: console.log });
    console.log("save");
  };

  const handleDelete = (id) => {
    if (apiObject.transaction) return;
    dispatch({ type: ApiActions.StartDel, func: console.log });
    console.log("delete");
  };

  return (
    <>
      <Header
        title={headerTitle}
        transaction={apiObject.transaction}
        create={handleCreate}
      />
      <Container>
        <Paper>
          {errorMsg && created ? (
            <Banner className="alert alert-danger">{errorMsg}</Banner>
          ) : (
            <Banner className="alert alert-success">{title}</Banner>
          )}
          <ListBox>
            {apiObject.inventory.map((item) => {
              return (
                <SimpleListItem
                  selected={selected}
                  setSelected={setSelected}
                  item={item}
                  allItems={apiObject.inventory}
                  key={item.id}
                  add={handleSave}
                  del={handleDelete}
                  errorMsg={errorMsg}
                  setErrorMsg={setErrorMsg}
                  setCreated={setCreated}
                  transaction={apiObject.transaction}
                />
              );
            })}
            {created ? (
              <SimpleListItem
                item={created}
                allItems={apiObject.inventory}
                selected={selected}
                setSelected={setSelected}
                add={handleSave}
                delete={handleDelete}
                errorMsg={errorMsg}
                setErrorMsg={setErrorMsg}
                setCreated={setCreated}
                transaction={apiObject.transaction}
              />
            ) : null}
          </ListBox>
        </Paper>
      </Container>
    </>
  );
};

export default SimpleList;
