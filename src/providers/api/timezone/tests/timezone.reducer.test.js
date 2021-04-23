import timezoneReducer from "../timezone.reducer";
import {
  asyncAdd,
  asyncDel,
  asyncGet,
  asyncList,
  asyncUpdate,
} from "../timezone.async";

import InitialState from "../timezone.initial";
import { ReducerTest } from "../../test.fixtures/generate.reducer.tests";
jest.mock("../timezone.async");

ReducerTest(
  "timezone",
  timezoneReducer,
  InitialState,
  asyncAdd,
  asyncDel,
  asyncGet,
  asyncList,
  asyncUpdate
);
