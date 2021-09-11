import { ReducerTest } from "../../test.fixtures/generate.reducer.tests";
import {
  asyncAdd,
  asyncDel,
  asyncGet,
  asyncList,
  asyncUpdate,
} from "../activity.async";
import InitialState from "../activity.initial";
import ActivityReducer from "../activity.reducer";

jest.mock("../activity.async");

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
