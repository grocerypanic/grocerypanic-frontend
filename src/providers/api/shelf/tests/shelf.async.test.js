import { Paths } from "../../../../configuration/backend";
import ApiFunctions from "../../api.functions";
import { generateConverter } from "../../generators/generate.converter";
import { AsyncTest } from "../../test.fixtures/generate.async.tests";
import * as AsyncFn from "../shelf.async";
import InitialState from "../shelf.initial";

jest.mock("../../../../util/requests");

const implemented = [
  ApiFunctions.asyncAdd,
  ApiFunctions.asyncDel,
  ApiFunctions.asyncList,
];

AsyncTest(
  Paths.manageShelves,
  InitialState,
  AsyncFn,
  generateConverter(InitialState.class),
  implemented
);
