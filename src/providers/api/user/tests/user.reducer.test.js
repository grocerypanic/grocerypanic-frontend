import { ReducerTest } from "../../test.fixtures/generate.reducer.tests";
import {
  asyncAdd,
  asyncDel,
  asyncGet,
  asyncList,
  asyncUpdate,
} from "../user.async";
import InitialState from "../user.initial";
import UserReducer from "../user.reducer";

jest.mock("../user.async");

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
