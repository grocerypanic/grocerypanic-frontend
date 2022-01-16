import { DynamicPaths } from "../../../../configuration/backend";
import ApiFunctions from "../../api.functions";
import { generateUTCConverter } from "../../generators/generate.converter";
import { AsyncTest } from "../../test.fixtures/generate.async.tests";
import * as AsyncFn from "../activity.async";
import InitialState from "../activity.initial";

jest.mock("../../../../util/requests");

const implemented = [ApiFunctions.asyncGet];

AsyncTest(
  DynamicPaths.manageActivity,
  InitialState,
  AsyncFn,
  generateUTCConverter(InitialState.class),
  implemented,
  {
    item: 1,
  }
);
