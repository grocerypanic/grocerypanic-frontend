import * as async from "./timezone.async";

import generateReducer from "../generators/generate.reducer";

export default generateReducer(async, "timezoneReducer");
