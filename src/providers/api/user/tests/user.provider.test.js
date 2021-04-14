import UserProvider, { UserContext } from "../user.provider";
import InitialState from "../user.initial";

import { ProviderTest } from "../../test.fixtures/generate.provider.tests";

ProviderTest(UserProvider, UserContext, InitialState);
