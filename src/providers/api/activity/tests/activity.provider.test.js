import ActivityProvider, { ActivityContext } from "../activity.provider";
import InitialState from "../activity.initial";

import { ProviderTest } from "../../test.fixtures/generate.provider.tests";

ProviderTest(ActivityProvider, ActivityContext, InitialState);
