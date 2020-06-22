import * as async from "./shelf.async";

import generateReducer from "../generators/generate.reducer";

export default generateReducer(async, "shelfReducer");
