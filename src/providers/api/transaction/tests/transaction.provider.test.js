import { ProviderTest } from "../../test.fixtures/generate.provider.tests";
import InitialState from "../transaction.initial";
import TransactionProvider, {
  TransactionContext,
} from "../transaction.provider";

ProviderTest(TransactionProvider, TransactionContext, InitialState);
