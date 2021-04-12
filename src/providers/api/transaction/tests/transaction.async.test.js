import InitialState from "../transaction.initial";

import { Paths } from "../../../../configuration/backend";
import * as AsyncFn from "../transaction.async";

import { AsyncTest } from "../../test.fixtures/generate.async.tests";
import ApiFunctions from "../../api.functions";

import { Constants } from "../../../../configuration/backend";
import { generateConverter } from "../../generators/generate.converter";

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
