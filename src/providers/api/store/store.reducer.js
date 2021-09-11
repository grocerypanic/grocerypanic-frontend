import * as async from "./store.async";
import generateReducer from "../generators/generate.reducer";

export default generateReducer(async, "storeReducer");
