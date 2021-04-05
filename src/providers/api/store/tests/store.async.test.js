import InitialState from "../store.initial";

import { Paths } from "../../../../configuration/backend";
import * as AsyncFn from "../store.async";

import { AsyncTest } from "../../test.fixtures/generate.async.tests";
import ApiFunctions from "../../api.functions";
import { generateConverter } from "../../generators/generate.converter";

jest.mock("../../../../util/requests");

const implemented = [
  ApiFunctions.asyncAdd,
  ApiFunctions.asyncDel,
  ApiFunctions.asyncList,
];

AsyncTest(
  Paths.manageStores,
  InitialState,
  AsyncFn,
  generateConverter(InitialState.class),
  implemented
);
