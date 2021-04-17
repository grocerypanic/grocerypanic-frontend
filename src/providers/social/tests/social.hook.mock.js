import InitialState from "../social.initial";

const mockHook = {
  social: {
    socialLogin: { ...InitialState },
    error: jest.fn(),
    expiredAuth: jest.fn(),
    login: jest.fn(),
    reset: jest.fn(),
  },
};

export default mockHook;
