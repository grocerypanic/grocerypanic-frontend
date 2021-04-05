import ActivityReducer from "../activity.reducer";
import {
  asyncAdd,
  asyncDel,
  asyncGet,
  asyncList,
  asyncUpdate,
} from "../activity.async";

import InitialState from "../activity.initial";
import { ReducerTest } from "../../test.fixtures/generate.reducer.tests";
jest.mock("../activity.async");

InitialState.inventory = [];

ReducerTest(
  "activity",
  ActivityReducer,
  InitialState,
  asyncAdd,
  asyncDel,
  asyncGet,
  asyncList,
  asyncUpdate
);
