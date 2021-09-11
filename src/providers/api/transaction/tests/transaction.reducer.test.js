import { ReducerTest } from "../../test.fixtures/generate.reducer.tests";
import {
  asyncAdd,
  asyncDel,
  asyncGet,
  asyncList,
  asyncUpdate,
} from "../transaction.async";
import InitialState from "../transaction.initial";
import TransactionReducer from "../transaction.reducer";

jest.mock("../transaction.async");

ReducerTest(
  "transaction",
  TransactionReducer,
  InitialState,
  asyncAdd,
  asyncDel,
  asyncGet,
  asyncList,
  asyncUpdate
);
