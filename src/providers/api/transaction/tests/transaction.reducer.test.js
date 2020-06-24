import TransactionReducer from "../transaction.reducer";
import {
  asyncAdd,
  asyncDel,
  asyncGet,
  asyncList,
  asyncUpdate,
} from "../transaction.async";

import InitialState from "../transaction.initial";
import { ReducerTest } from "../../test.fixtures/generate.reducer.tests";
jest.mock("../transaction.async");

InitialState.inventory = [];

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
