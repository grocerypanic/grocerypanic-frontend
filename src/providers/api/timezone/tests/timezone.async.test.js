import { Paths } from "../../../../configuration/backend";
import ApiFunctions from "../../api.functions";
import { generateConverter } from "../../generators/generate.converter";
import { AsyncTest } from "../../test.fixtures/generate.async.tests";
import * as AsyncFn from "../timezone.async";
import InitialState from "../timezone.initial";

jest.mock("../../../../util/requests");

const implemented = [ApiFunctions.asyncList];

AsyncTest(
  Paths.manageTimezones,
  InitialState,
  AsyncFn,
  generateConverter(InitialState.class),
  implemented
);
