import { ReducerTest } from "../../test.fixtures/generate.reducer.tests";
import {
  asyncAdd,
  asyncDel,
  asyncGet,
  asyncList,
  asyncUpdate,
} from "../timezone.async";
import InitialState from "../timezone.initial";
import timezoneReducer from "../timezone.reducer";

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
