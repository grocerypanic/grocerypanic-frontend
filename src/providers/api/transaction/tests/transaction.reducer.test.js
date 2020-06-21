import TransactionReducer from "../transaction.reducer";
import { asyncAdd, asyncDel, asyncList } from "../transaction.async";

import InitialState from "../transaction.initial";
import { ReducerTest } from "../../test.fixtures/generate.reducer.tests";
jest.mock("../transaction.async");

InitialState.inventory = [];

ReducerTest(TransactionReducer, InitialState, asyncAdd, asyncDel, asyncList);
