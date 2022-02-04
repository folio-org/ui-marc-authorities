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

describe('Given useAuthoritiesBrowse', () => {
  const searchQuery = 'test';
  const searchIndex = searchableIndexesValues.NONE;
  const precedingRecordsCount = 5;

  const generateTestAuthorities = (count, headingRef = 'authority') => new Array(count).fill({}).map((_, index) => ({
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
    const isExcludedSeeFromLimiter = false;
    const pageSize = 20;

    const { result, waitFor } = renderHook(() => useAuthoritiesBrowse({
      searchQuery,
      searchIndex,
      isExcludedSeeFromLimiter,
      pageSize,
      precedingRecordsCount,
    }), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(mockGet).toHaveBeenCalledTimes(3);
    expect(mockGet.mock.calls[0][0])
      // browse/authorities?limit=20&precedingRecordsCount=5&query=(headingRef>="test" or headingRef<"test")
      .toBe('browse/authorities?limit=20&precedingRecordsCount=5&query=%28headingRef%3E%3D%22test%22%20or%20headingRef%3C%22test%22%29');
    expect(mockGet.mock.calls[1][0])
      // browse/authorities?limit=20&precedingRecordsCount=5&query=headingRef<"authority_0_0"
      .toBe('browse/authorities?limit=20&precedingRecordsCount=5&query=headingRef%3C%22authority_0_0%22');

    expect(mockGet.mock.calls[2][0])
      // browse/authorities?limit=20&precedingRecordsCount=5&query=headingRef>"authority_0_49"
      .toBe('browse/authorities?limit=20&precedingRecordsCount=5&query=headingRef%3E%22authority_0_49%22');
  });

  describe('when passing isExcludeSeeFrom parameter', () => {
    it('should include headingType parameter in requests', async () => {
      const isExcludedSeeFromLimiter = true;
      const pageSize = 20;

      const { result, waitFor } = renderHook(() => useAuthoritiesBrowse({
        searchQuery,
        searchIndex,
        isExcludedSeeFromLimiter,
        pageSize,
        precedingRecordsCount,
      }), { wrapper });

      await waitFor(() => !result.current.isLoading);

      expect(mockGet).toHaveBeenCalledTimes(3);
      expect(mockGet.mock.calls[0][0])
        // browse/authorities?limit=20&precedingRecordsCount=5&query=(headingRef>="test" or headingRef<"test") and authRefType==Authorized
        .toBe('browse/authorities?limit=20&precedingRecordsCount=5&query=%28headingRef%3E%3D%22test%22%20or%20headingRef%3C%22test%22%29%20and%20authRefType%3D%3DAuthorized');
      expect(mockGet.mock.calls[1][0])
        // browse/authorities?limit=20&precedingRecordsCount=5&query=headingRef<"authority_0" and authRefType==Authorized
        .toBe('browse/authorities?limit=20&precedingRecordsCount=5&query=headingRef%3C%22authority_0_0%22%20and%20authRefType%3D%3DAuthorized');

      expect(mockGet.mock.calls[2][0])
        // browse/authorities?limit=20&precedingRecordsCount=5&query=headingRef>"authority_49" and authRefType==Authorized
        .toBe('browse/authorities?limit=20&precedingRecordsCount=5&query=headingRef%3E%22authority_0_49%22%20and%20authRefType%3D%3DAuthorized');
    });
  });

  describe('when requesting a previous page', () => {
    it('should only request one more previous page', async () => {
      const isExcludedSeeFromLimiter = false;
      const pageSize = 20;

      const { result, waitFor } = renderHook(() => useAuthoritiesBrowse({
        searchQuery,
        searchIndex,
        isExcludedSeeFromLimiter,
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
      expect(mockGet.mock.calls[0][0])
        // browse/authorities?limit=20&precedingRecordsCount=5&query=headingRef<"authority_1_0"
        .toBe('browse/authorities?limit=20&precedingRecordsCount=5&query=headingRef%3C%22authority_1_0%22');
    });
  });

  describe('when going to prev page and back to main', () => {
    it('should not request previously loaded pages again', async () => {
      const isExcludedSeeFromLimiter = false;
      const pageSize = 20;

      const { result, waitFor } = renderHook(() => useAuthoritiesBrowse({
        searchQuery,
        searchIndex,
        isExcludedSeeFromLimiter,
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
});
