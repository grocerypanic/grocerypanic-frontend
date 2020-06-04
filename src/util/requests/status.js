const match2xx = (statusCode) => {
  return statusCode.toString()[0] === "2";
};

export default match2xx;
