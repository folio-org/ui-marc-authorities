import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import '../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import useFacets from './useFacets';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('Given useFacets', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve({
      facets: {},
      totalRecords: 0,
    }),
  }));

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('should fetch facets', async () => {
    const { result, waitFor } = renderHook(() => useFacets({
      query: 'test=abc',
      selectedFacets: ['filterA', 'filterB'],
    }), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(mockGet).toHaveBeenCalledWith('search/authorities/facets?facet=filterA%2CfilterB&query=test%3Dabc');
  });

  describe('when filters change', () => {
    it('should re-fetch facets', async () => {
      const { result, waitFor, rerender } = renderHook(() => useFacets({
        query: 'test=abc',
        selectedFacets: ['filterA'],
      }), { wrapper });

      await waitFor(() => !result.current.isLoading);

      expect(mockGet).toHaveBeenCalledWith('search/authorities/facets?facet=filterA&query=test%3Dabc');

      rerender({ selectedFacets: ['filterB'] });

      expect(mockGet).toHaveBeenCalledWith('search/authorities/facets?facet=filterA%2CfilterB&query=test%3Dabc');
    });
  });
});
