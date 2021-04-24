import InitialState from "../user.initial";

const generateMock = () => {
  return {
    profile: {
      user: { ...InitialState },
      getProfile: jest.fn(),
      updateProfile: jest.fn(),
      clearErrors: jest.fn(),
    },
  };
};

export default generateMock;
