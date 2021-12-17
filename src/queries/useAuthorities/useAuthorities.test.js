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
import { searchResultListColumns, sortOrders } from '../../constants';

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
    const searchIndex = 'identifier';
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
      it('should add "sortBy authRefType/sort.descending" to query', () => {
        const { result } = renderHook(() => useAuthorities({
          searchQuery,
          filters: {},
          sortOrder: sortOrders.DES,
          sortedColumn: searchResultListColumns.AUTH_REF_TYPE,
        }), { wrapper });

        expect(result.current.query).toEqual('(keyword=="test") sortBy authRefType/sort.descending');
      });
    });

    describe('when sort order is "descending"', () => {
      it('should add "sortBy authRefType/sort.ascending" to query', () => {
        const { result } = renderHook(() => useAuthorities({
          searchQuery,
          filters: {},
          sortOrder: sortOrders.ASC,
          sortedColumn: searchResultListColumns.AUTH_REF_TYPE,
        }), { wrapper });

        expect(result.current.query).toEqual('(keyword=="test") sortBy authRefType/sort.ascending');
      });
    });
  });
});
