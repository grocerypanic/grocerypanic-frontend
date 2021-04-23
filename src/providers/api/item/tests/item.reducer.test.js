import ItemReducer from "../item.reducer";
import {
  asyncAdd,
  asyncDel,
  asyncGet,
  asyncList,
  asyncUpdate,
} from "../item.async";

import InitialState from "../item.initial";
import { ReducerTest } from "../../test.fixtures/generate.reducer.tests";
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
