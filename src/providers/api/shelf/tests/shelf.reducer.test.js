import ShelfReducer from "../shelf.reducer";
import {
  asyncAdd,
  asyncDel,
  asyncGet,
  asyncList,
  asyncUpdate,
} from "../shelf.async";

import InitialState from "../shelf.initial";
import { ReducerTest } from "../../test.fixtures/generate.reducer.tests";
jest.mock("../shelf.async");

InitialState.inventory = [];

ReducerTest(
  "shelf",
  ShelfReducer,
  InitialState,
  asyncAdd,
  asyncDel,
  asyncGet,
  asyncList,
  asyncUpdate
);
