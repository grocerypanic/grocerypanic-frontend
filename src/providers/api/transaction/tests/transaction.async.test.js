import InitialState from "../transaction.initial";

import { Paths } from "../../../../configuration/backend";
import * as AsyncFn from "../transaction.async";

import { AsyncTest } from "../../test.fixtures/generate.async.tests";
import ApiFunctions from "../../api.functions";

import { Constants } from "../../../../configuration/backend";

jest.mock("../../../../util/requests");

const implemented = [ApiFunctions.asyncAdd, ApiFunctions.asyncList];

AsyncTest(Paths.manageTransactions, InitialState, AsyncFn, implemented, {
  item: 1,
  history: Constants.retrievedTransactionHistory,
});
