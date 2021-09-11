import { ProviderTest } from "../../test.fixtures/generate.provider.tests";
import InitialState from "../user.initial";
import UserProvider, { UserContext } from "../user.provider";

ProviderTest(UserProvider, UserContext, InitialState);
