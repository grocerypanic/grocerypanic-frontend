import { ReducerTest } from "../../test.fixtures/generate.reducer.tests";
import {
  asyncAdd,
  asyncDel,
  asyncGet,
  asyncList,
  asyncUpdate,
} from "../item.async";
import InitialState from "../item.initial";
import ItemReducer from "../item.reducer";

jest.mock("../item.async");

ReducerTest(
  "item",
  ItemReducer,
  InitialState,
  asyncAdd,
  asyncDel,
  asyncGet,
  asyncList,
  asyncUpdate
);
