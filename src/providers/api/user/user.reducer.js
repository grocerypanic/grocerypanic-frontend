import * as async from "./user.async";

import generateReducer from "../generators/generate.reducer";

export default generateReducer(async, "userReducer");
