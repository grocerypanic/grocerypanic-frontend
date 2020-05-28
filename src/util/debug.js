const debug = (message) => {
  if (process.env.NODE_ENV !== "production") {
    console.debug(message);
  }
};

export default debug;
