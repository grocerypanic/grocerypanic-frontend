import { ProviderTest } from "../../test.fixtures/generate.provider.tests";
import InitialState from "../timezone.initial";
import TimezonesProvider, { TimezoneContext } from "../timezone.provider";

ProviderTest(TimezonesProvider, TimezoneContext, InitialState);
