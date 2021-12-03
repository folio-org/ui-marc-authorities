import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import '../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { useAuthorities } from './useAuthorities';

const history = {
  replace: jest.fn(),
};

const location = {
  pathname: 'pathname',
  search: '',
};

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('Given useAuthorities', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve({
      authorities: [],
      totalRecords: 0,
    }),
  }));

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('fetches authorities records', async () => {
    const searchQuery = 'test';
    const searchIndex = 'identifier';

    const { result, waitFor } = renderHook(() => useAuthorities({ searchQuery, searchIndex, location, history }), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(mockGet).toHaveBeenCalledWith(
      'search/authorities',
      {
        searchParams: {
          query: '(identifier=="test*")',
        },
      },
    );
  });
});
