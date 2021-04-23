import InitialState from "../timezone.initial";

import { Paths } from "../../../../configuration/backend";
import * as AsyncFn from "../timezone.async";

import { AsyncTest } from "../../test.fixtures/generate.async.tests";
import ApiFunctions from "../../api.functions";

import { generateConverter } from "../../generators/generate.converter";

jest.mock("../../../../util/requests");

const implemented = [ApiFunctions.asyncList];

AsyncTest(
  Paths.manageTimezones,
  InitialState,
  AsyncFn,
  generateConverter(InitialState.class),
  implemented
);
