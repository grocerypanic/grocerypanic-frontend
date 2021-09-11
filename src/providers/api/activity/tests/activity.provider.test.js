import { ProviderTest } from "../../test.fixtures/generate.provider.tests";
import InitialState from "../activity.initial";
import ActivityProvider, { ActivityContext } from "../activity.provider";

ProviderTest(ActivityProvider, ActivityContext, InitialState);
