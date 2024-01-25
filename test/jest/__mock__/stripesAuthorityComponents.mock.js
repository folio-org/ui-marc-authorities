jest.mock('@folio/stripes-authority-components', () => ({
  ...jest.requireActual('@folio/stripes-authority-components'),
  useUserTenantPermissions: jest.fn().mockReturnValue({
    userPermissions: [],
    isFetching: false,
  }),
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
