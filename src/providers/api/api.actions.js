// Generic Actions That Can Be Applied to All API Objects

const ApiActions = {
  ClearErrors: "ClearErrors",
  FailureAuth: "FailureAuth",
  DuplicateObject: "DuplicateObject",
  RequiredObject: "RequiredObject",
  // Add An Api Object
  StartAdd: "StartAdd",
  SuccessAdd: "SuccessAdd",
  FailureAdd: "FailureAdd",
  // Delete An Api Object
  StartDel: "StartDel",
  SuccessDel: "SuccessDel",
  FailureDel: "FailureDel",
  // Get An Api Object
  StartGet: "StartGet",
  SuccessGet: "SuccessGet",
  FailureGet: "FailureGet",
  // List Api Objects
  StartList: "StartList",
  SuccessList: "SuccessList",
  FailureList: "FailureList",
  // Update an Api Object
  StartUpdate: "StartUpdate",
  SuccessUpdate: "SuccessUpdate",
  FailureUpdate: "FailureUpdate",
};

export default ApiActions;
