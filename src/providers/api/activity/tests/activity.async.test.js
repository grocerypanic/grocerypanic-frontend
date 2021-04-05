import InitialState from "../activity.initial";

import { Paths } from "../../../../configuration/backend";
import * as AsyncFn from "../activity.async";

import { AsyncTest } from "../../test.fixtures/generate.async.tests";
import ApiFunctions from "../../api.functions";
import { generateUTCConverter } from "../../generators/generate.converter";

jest.mock("../../../../util/requests");

const implemented = [ApiFunctions.asyncGet];

AsyncTest(
  Paths.manageActivity,
  InitialState,
  AsyncFn,
  generateUTCConverter(InitialState.class),
  implemented,
  {
    item: 1,
  }
);
