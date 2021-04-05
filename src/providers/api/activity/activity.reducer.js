import * as async from "./activity.async";

import generateReducer from "../generators/generate.reducer";

export default generateReducer(async, "activityReducer");
