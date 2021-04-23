import InitialState from "../timezone.initial";

const mockHook = {
  timezones: {
    timezones: { ...InitialState },
    getTimezones: jest.fn(),
  },
};

export default mockHook;
