import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import routeData from 'react-router';

import { createMemoryHistory } from 'history';

import '../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import Harness from '../../../test/jest/helpers/harness';
import useAuthorities from './useAuthorities';

const history = createMemoryHistory();

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <Harness history={history}>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </Harness>
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

    jest.spyOn(routeData, 'useLocation').mockReturnValue({
      pathname: 'pathname',
      search: '',
    });
  });

  it('fetches authorities records', async () => {
    const searchQuery = 'test';
    const searchIndex = 'identifier';

    const { result, waitFor } = renderHook(() => useAuthorities({ searchQuery, searchIndex }), { wrapper });

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
