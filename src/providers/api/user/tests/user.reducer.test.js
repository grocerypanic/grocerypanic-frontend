import UserReducer from "../user.reducer";
import {
  asyncAdd,
  asyncDel,
  asyncGet,
  asyncList,
  asyncUpdate,
} from "../user.async";

import InitialState from "../user.initial";
import { ReducerTest } from "../../test.fixtures/generate.reducer.tests";
jest.mock("../user.async");

InitialState.inventory = [];

ReducerTest(
  "user",
  UserReducer,
  InitialState,
  asyncAdd,
  asyncDel,
  asyncGet,
  asyncList,
  asyncUpdate
);
