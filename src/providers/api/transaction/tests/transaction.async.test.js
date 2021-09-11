import { Paths } from "../../../../configuration/backend";
import { Constants } from "../../../../configuration/backend";
import ApiFunctions from "../../api.functions";
import { generateConverter } from "../../generators/generate.converter";
import { AsyncTest } from "../../test.fixtures/generate.async.tests";
import * as AsyncFn from "../transaction.async";
import InitialState from "../transaction.initial";

jest.mock("../../../../util/requests");

const implemented = [ApiFunctions.asyncAdd];

AsyncTest(
  Paths.manageTransactions,
  InitialState,
  AsyncFn,
  generateConverter(InitialState.class),
  implemented,
  {
    item: 1,
    history: Constants.retrievedTransactionHistory,
  }
);
