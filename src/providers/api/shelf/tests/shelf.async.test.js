import InitialState from "../shelf.initial";

import { Paths } from "../../../../configuration/backend";
import * as AsyncFn from "../shelf.async";

import { AsyncTest } from "../../test.fixtures/generate.async.tests";
import ApiFunctions from "../../api.functions";

jest.mock("../../../../util/requests");

const implemented = [
  ApiFunctions.asyncAdd,
  ApiFunctions.asyncDel,
  ApiFunctions.asyncList,
];

AsyncTest(Paths.manageShelves, InitialState, AsyncFn, implemented);
