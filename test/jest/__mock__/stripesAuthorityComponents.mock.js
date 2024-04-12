jest.mock('@folio/stripes-authority-components', () => ({
  ...jest.requireActual('@folio/stripes-authority-components'),
  useUsers: jest.fn().mockReturnValue({
    users: [],
    isLoading: false,
  }),
  useAuthoritySourceFiles: jest.fn().mockReturnValue({
    sourceFiles: [],
    isLoading: false,
    createFile: jest.fn(),
    updateFile: jest.fn(),
    deleteFile: jest.fn(),
  }),
}));
