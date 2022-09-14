jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({
  height: 1000,
  width: 1000,
}));
