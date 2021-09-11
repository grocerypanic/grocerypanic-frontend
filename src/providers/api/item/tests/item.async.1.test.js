import { Paths } from "../../../../configuration/backend";
import ApiFunctions from "../../api.functions";
import { generateConverter } from "../../generators/generate.converter";
import { AsyncTest } from "../../test.fixtures/generate.async.tests";
import * as AsyncFn from "../item.async";
import InitialState from "../item.initial";

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
