import TimezonesProvider, { TimezoneContext } from "../timezone.provider";
import InitialState from "../timezone.initial";

import { ProviderTest } from "../../test.fixtures/generate.provider.tests";

ProviderTest(TimezonesProvider, TimezoneContext, InitialState);
