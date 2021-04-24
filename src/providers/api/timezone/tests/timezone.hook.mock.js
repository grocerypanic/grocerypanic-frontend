import InitialState from "../timezone.initial";

const generateMock = () => {
  return {
    timezones: {
      timezones: { ...InitialState },
      getTimezones: jest.fn(),
      clearErrors: jest.fn(),
    },
  };
};

export default generateMock;
