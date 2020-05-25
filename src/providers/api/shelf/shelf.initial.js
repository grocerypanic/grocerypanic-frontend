const mockData = [
  { id: 1, name: "Shelf1" },
  { id: 2, name: "Shelf2" },
  { id: 3, name: "Shelf3" },
];

const initialState = {
  inventory: mockData,
  transaction: false,
  error: false,
  errorMessage: null,
};

export default initialState;
