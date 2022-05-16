import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { act, renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';

import { useOkapiKy } from '@folio/stripes/core';

import useAuthoritiesBrowse from './useAuthoritiesBrowse';
import Harness from '../../../test/jest/helpers/harness';
import {
  FILTERS,
  REFERENCES_VALUES_MAP,
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

const decodeURIWithEquals = (string) => {
  return decodeURI(string).replace(/%3D/g, '=');
};

describe('Given useAuthoritiesBrowse', () => {
  const filters = {};
  const searchQuery = 'test';
  const searchIndex = searchableIndexesValues.PERSONAL_NAME;
  const precedingRecordsCount = 5;

  const generateTestAuthorities = (count, headingRef = 'authority') => new Array(count).fill({})
    .map((_, index) => ({
      headingRef: `${headingRef}_${index}`,
    }));

  const mockGet = jest.fn();

  beforeEach(() => {
    let callCount = 0;

    queryClient.clear();
    mockGet.mockClear();
    useOkapiKy.mockClear();
    mockGet.mockImplementation(() => ({
      json: () => Promise.resolve({
        items: generateTestAuthorities(50, `authority_${callCount++}`),
        totalRecords: 100,
      }),
    }));

    useOkapiKy.mockReturnValue({
      get: mockGet,
    });
  });

  it('should fetch main page, previous and next pages', async () => {
    const pageSize = 20;

    const { result, waitFor } = renderHook(() => useAuthoritiesBrowse({
      filters,
      searchQuery,
      searchIndex,
      pageSize,
      precedingRecordsCount,
    }), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(mockGet).toHaveBeenCalledTimes(3);
    expect(decodeURIWithEquals(mockGet.mock.calls[0][0]))
      .toBe('browse/authorities?limit=20&precedingRecordsCount=5&query=(headingRef>="test" or headingRef<"test") and headingTypeExt<>"Title" and headingType==("Personal Name")');
    expect(decodeURIWithEquals(mockGet.mock.calls[1][0]))
      .toBe('browse/authorities?limit=20&precedingRecordsCount=5&query=headingRef<"authority_0_0" and headingTypeExt<>"Title" and headingType==("Personal Name")');
    expect(decodeURIWithEquals(mockGet.mock.calls[2][0]))
      .toBe('browse/authorities?limit=20&precedingRecordsCount=5&query=headingRef>"authority_0_49" and headingTypeExt<>"Title" and headingType==("Personal Name")');
  });

  describe('when requesting a previous page', () => {
    it('should only request one more previous page', async () => {
      const pageSize = 20;

      const { result, waitFor } = renderHook(() => useAuthoritiesBrowse({
        filters,
        searchQuery,
        searchIndex,
        pageSize,
        precedingRecordsCount,
      }), { wrapper });

      await waitFor(() => !result.current.isLoading);

      mockGet.mockClear();

      act(() => {
        result.current.handleLoadMore(null, null, null, 'prev');
      });

      await waitFor(() => !result.current.isLoading);

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(decodeURIWithEquals(mockGet.mock.calls[0][0]))
        .toBe('browse/authorities?limit=20&precedingRecordsCount=5&query=headingRef<"authority_1_0" and headingTypeExt<>"Title" and headingType==("Personal Name")');
    });
  });

  describe('when going to prev page and back to main', () => {
    it('should not request previously loaded pages again', async () => {
      const pageSize = 20;

      const { result, waitFor } = renderHook(() => useAuthoritiesBrowse({
        filters,
        searchQuery,
        searchIndex,
        pageSize,
        precedingRecordsCount,
      }), { wrapper });

      await waitFor(() => !result.current.isLoading);

      act(() => {
        result.current.handleLoadMore(null, null, null, 'prev');
      });

      await waitFor(() => !result.current.isLoading);

      mockGet.mockClear();

      act(() => {
        result.current.handleLoadMore(null, null, null, 'next');
      });

      await waitFor(() => !result.current.isLoading);

      expect(mockGet).toHaveBeenCalledTimes(0);
    });
  });

  describe('when search query changes', () => {
    it('should request new data', async () => {
      const pageSize = 20;

      const { result, waitFor, rerender } = renderHook(useAuthoritiesBrowse, {
        initialProps: {
          filters,
          searchQuery,
          searchIndex,
          pageSize,
          precedingRecordsCount,
        },
        wrapper,
      });

      await waitFor(() => !result.current.isLoading);

      expect(mockGet).toHaveBeenCalledTimes(3);

      rerender({
        filters,
        searchQuery: 'test2',
        searchIndex,
        pageSize,
        precedingRecordsCount,
      }, { wrapper });

      await waitFor(() => !result.current.isLoading);

      expect(mockGet).toHaveBeenCalledTimes(6);
      expect(decodeURIWithEquals(mockGet.mock.calls[3][0]))
        .toBe('browse/authorities?limit=20&precedingRecordsCount=5&query=(headingRef>="test2" or headingRef<"test2") and headingTypeExt<>"Title" and headingType==("Personal Name")');
      expect(decodeURIWithEquals(mockGet.mock.calls[4][0]))
        .toBe('browse/authorities?limit=20&precedingRecordsCount=5&query=headingRef<"authority_3_0" and headingTypeExt<>"Title" and headingType==("Personal Name")');
      expect(decodeURIWithEquals(mockGet.mock.calls[5][0]))
        .toBe('browse/authorities?limit=20&precedingRecordsCount=5&query=headingRef>"authority_3_49" and headingTypeExt<>"Title" and headingType==("Personal Name")');
    });
  });

  describe('when filters are applied', () => {
    it('should request data based on the filters', async () => {
      const pageSize = 20;

      const { result, waitFor } = renderHook(() => useAuthoritiesBrowse({
        filters: {
          [FILTERS.REFERENCES]: [
            REFERENCES_VALUES_MAP.excludeSeeFrom,
            REFERENCES_VALUES_MAP.excludeSeeFromAlso,
          ],
        },
        searchQuery,
        searchIndex,
        pageSize,
        precedingRecordsCount,
      }), { wrapper });

      await waitFor(() => !result.current.isLoading);

      expect(mockGet).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('%28authRefType%3D%3D%28%22Authorized%22%29'), // (authRefType==("Authorized"))
      );
    });
  });
});
