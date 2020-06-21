import TransactionProvider, {
  TransactionContext,
} from "../transaction.provider";
import InitialState from "../transaction.initial";

import { ProviderTest } from "../../test.fixtures/generate.provider.tests";

ProviderTest(TransactionProvider, TransactionContext, InitialState);
