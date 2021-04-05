import InitialState from "../item.initial";

import { Paths } from "../../../../configuration/backend";
import * as AsyncFn from "../item.async";

import { AsyncTest } from "../../test.fixtures/generate.async.tests";
import ApiFunctions from "../../api.functions";
import { generateConverter } from "../../generators/generate.converter";

jest.mock("../../../../util/requests");

const implemented = [
  ApiFunctions.asyncAdd,
  ApiFunctions.asyncDel,
  ApiFunctions.asyncList,
  ApiFunctions.asyncGet,
  ApiFunctions.asyncUpdate,
];

AsyncTest(
  Paths.manageItems,
  InitialState,
  AsyncFn,
  generateConverter(InitialState.class),
  implemented
);
