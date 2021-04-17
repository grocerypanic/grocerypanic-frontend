import InitialState from "../user.initial";

const mockHook = {
  profile: {
    user: { ...InitialState },
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
  },
};

export default mockHook;
