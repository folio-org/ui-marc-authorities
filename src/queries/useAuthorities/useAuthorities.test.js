import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';

import { useOkapiKy } from '@folio/stripes/core';

import Harness from '../../../test/jest/helpers/harness';
import useAuthorities from './useAuthorities';
import {
  searchResultListColumns,
  sortOrders,
  searchableIndexesValues,
} from '../../constants';

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
  const searchQuery = 'test';
  const searchIndex = searchableIndexesValues.KEYWORD;

  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve({
      authorities: [],
      totalRecords: 0,
    }),
  }));

  beforeEach(() => {
    queryClient.clear();
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('fetches authorities records', async () => {
    const filters = {
      updatedDate: ['2021-01-01:2021-12-31'],
    };
    const isExcludedSeeFromLimiter = false;
    const pageSize = 20;

    const { result, waitFor } = renderHook(() => useAuthorities({
      searchQuery,
      searchIndex,
      filters,
      isExcludedSeeFromLimiter,
      pageSize,
      sortOrder: '',
      sortedColumn: '',
    }), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(mockGet).toHaveBeenCalled();
  });

  describe('when sort options are presented', () => {
    describe('when sort order is "descending"', () => {
      it('should add "sortBy authRefType/sort.descending" to query', async () => {
        const { result, waitFor } = renderHook(() => useAuthorities({
          searchQuery,
          searchIndex,
          filters: {},
          sortOrder: sortOrders.DES,
          sortedColumn: searchResultListColumns.AUTH_REF_TYPE,
        }), { wrapper });

        await waitFor(() => !result.current.isLoading);

        expect(result.current.query).toEqual('(keyword=="test") sortBy authRefType/sort.descending');
      });
    });

    describe('when sort order is "descending"', () => {
      it('should add "sortBy authRefType/sort.ascending" to query', async () => {
        const { result, waitFor } = renderHook(() => useAuthorities({
          searchQuery,
          searchIndex,
          filters: {},
          sortOrder: sortOrders.ASC,
          sortedColumn: searchResultListColumns.AUTH_REF_TYPE,
        }), { wrapper });

        await waitFor(() => !result.current.isLoading);

        expect(result.current.query).toEqual('(keyword=="test") sortBy authRefType/sort.ascending');
      });
    });
  });
});
