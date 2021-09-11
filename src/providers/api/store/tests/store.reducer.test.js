import { ReducerTest } from "../../test.fixtures/generate.reducer.tests";
import {
  asyncAdd,
  asyncDel,
  asyncGet,
  asyncList,
  asyncUpdate,
} from "../store.async";
import InitialState from "../store.initial";
import StoreReducer from "../store.reducer";

jest.mock("../store.async");

ReducerTest(
  "store",
  StoreReducer,
  InitialState,
  asyncAdd,
  asyncDel,
  asyncGet,
  asyncList,
  asyncUpdate
);
